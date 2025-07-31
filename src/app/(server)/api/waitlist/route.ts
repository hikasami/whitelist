import { addToWaitlist } from "@/lib/redis";
import arcjet, { validateEmail } from "@arcjet/next";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    validateEmail({
      mode: "LIVE",
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});

const emailSchema = z.object({
  email: z.string().email("Пожалуйста, введите адрес электронной почты в правильном формате."),
});

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Ошибка при разборе JSON:", parseError);
      return NextResponse.json(
        {
          success: false,
          message: "Недопустимое тело запроса",
        },
        { status: 400 }
      );
    }

    const result = emailSchema.safeParse(body);
    if (!result.success) {
      const errorMessage =
        result.error.errors[0]?.message ?? "Недопустимый формат адреса электронной почты";
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const decision = await aj.protect(request, { email });

    if (decision.isDenied()) {
      console.warn("Arcjet отклонил email:", email, "Причина:", decision.reason);
      return NextResponse.json(
        { success: false, message: "Проверка почтового адреса не пройдена" },
        { status: 403 }
      );
    }

    const added = await addToWaitlist(email);

    if (!added) {
      return NextResponse.json(
        { success: false, message: "Почтовый адрес уже зарегистрирован" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Вы успешно записались в лист ожидания!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при отправке в лист ожидания:", error);
    return NextResponse.json(
      { success: false, message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз." },
      { status: 500 }
    );
  }
}
