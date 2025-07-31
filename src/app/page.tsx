import { Counter } from "@/components/counter";
import { Button } from "@/components/ui/button";
import SplitText from "@/components/ui/split-text";
import { WaitlistForm } from "@/components/waitlist-form";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col h-screen justify-center items-center text-center">
      <div className="mb-8">
        <SplitText className="text-5xl tracking-tighter font-medium">
          🎌 Получите ранний доступ к Hikasami
        </SplitText>
        <SplitText className="tracking-tight text-xl max-w-5xl mx-auto mt-4">
          Hikasami — это ваш персональный помощник в мире аниме. 
          Смотрите тайтлы онлайн, отслеживайте прогресс, планируйте просмотры и делитесь впечатлениями с другими поклонниками. 
          Всё для комфортного аниме-опыта — в одном месте.
        </SplitText>
      </div>
      <WaitlistForm />
      <div className="mt-4">
        <Counter />
      </div>
      <footer className="sticky top-[100vh]">
        <Button size="icon" variant="ghost">
          <Link href="https://github.com/hikasami" target="_blank">
            <FaGithub />
          </Link>
        </Button>
      </footer>
    </div>
  );
}
