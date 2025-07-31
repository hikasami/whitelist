import { getWaitlistCount } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const count = await getWaitlistCount();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Ошибка API при получении количества в листе ожидания:", error);

    return NextResponse.json(
      { message: "Не удалось получить количество в листе ожидания." },
      { status: 500 }
    );
  }
}
