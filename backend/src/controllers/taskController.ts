import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import prisma from "../utils/prisma.js";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED"]).optional(),
});

export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { page = 1, limit = 10, status, search } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = { userId };
  if (status) where.status = String(status);
  if (search) {
    where.OR = [
      { title: { contains: String(search) } },
      { description: { contains: String(search) } },
    ];
  }

  try {
    const tasks = await prisma.task.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.task.count({ where });

    res.json({
      tasks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = taskSchema.parse(req.body);
    const userId = req.userId!;

    const task = await prisma.task.create({
      data: { title, description, userId },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Validation error", error });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  const task = await prisma.task.findFirst({ where: { id: String(id), userId } });
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    const data = taskSchema.partial().parse(req.body);
    const task = await prisma.task.findFirst({ where: { id: String(id), userId } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const updatedTask = await prisma.task.update({
      where: { id: String(id) },
      data,
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Validation error", error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  const task = await prisma.task.findFirst({ where: { id: String(id), userId } });
  if (!task) return res.status(404).json({ message: "Task not found" });

  await prisma.task.delete({ where: { id: String(id) } });
  res.json({ message: "Task deleted successfully" });
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  const task = await prisma.task.findFirst({ where: { id: String(id), userId } });
  if (!task) return res.status(404).json({ message: "Task not found" });

  const updatedTask = await prisma.task.update({
    where: { id: String(id) },
    data: { status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED" },
  });

  res.json(updatedTask);
};
