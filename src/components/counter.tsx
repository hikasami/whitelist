"use client";
import { useState, useEffect } from "react";
import * as motion from "motion/react-client";

export function Counter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/waitlist/count");
        if (!response.ok) {
          throw new Error(
            `Не удалось получить количество: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();

        if (typeof data.count !== "number") {
          throw new Error("Получено некорректное значение количества от API");
        }

        setCount(data.count);
      } catch (err) {
        console.error("Ошибка при получении количества в списке ожидания:", err);
        setError(
          err instanceof Error ? err.message : "Произошла неизвестная ошибка"
        );
        setCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, []);

  if (isLoading) {
    return <div className="h-6" aria-live="polite"></div>;
  }

  if (error) {
    return null;
  }

  if (count === null) {
    return null;
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 2, type: "spring" }}
      className="text-sm text-muted-foreground"
      aria-live="polite"
    >
    Присоединяйтесь к <span className="font-bold">{count.toLocaleString()}</span>+ другим, кто уже зарегистрировался
    </motion.p>
  );
}
