export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type Habit = {
  id: string;
  name: string;
  completedDates: string[];
};
