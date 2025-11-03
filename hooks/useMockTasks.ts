import { useEffect, useState } from 'react';
import { mockTasks } from '../mock/mockData';

// 控制是否启用 Mock 数据
const USE_MOCK = true;

// Type definition for task
interface Task {
  date: string;
  projectName: string;
  task: string;
  mood: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (USE_MOCK) {
      setTasks(mockTasks);
    } else {
      fetch('/api/tasks') // 替换成你真实数据源
        .then((res) => res.json())
        .then((data) => setTasks(data));
    }
  }, []);

  return tasks;
}
