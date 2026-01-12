import type { Todo } from "@packages/shared";
import { Circle, CircleArrowRight, CircleCheck, CircleX, ListTodo } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CardContentItem } from "@/components/ui/card";
import { useGetKv } from "@/lib/convex";
import { useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";

export function TodoList() {
	const { chat } = useAppState();
	const { data: todos } = useGetKv(`todo:${chat.id}`) as { data: Todo[] | undefined };
	const isTodoEmpty = todos?.length === 0 || todos === null || todos === undefined;
	const completedTodos = todos?.filter((todo) => todo.status === "completed");
	const iconMap = {
		pending: <Circle className="size-3.5 shrink-0" />,
		in_progress: <CircleArrowRight className="size-3.5 shrink-0" />,
		completed: <CircleCheck className="size-3.5 shrink-0 text-green-500" />,
	};

	return (
		<CardContentItem className={cn("flex p-0", isTodoEmpty && "hidden")}>
			<Accordion className={"w-full"}>
				<AccordionItem>
					<AccordionTrigger className="gap-2 rounded-b-none p-2 text-muted-foreground text-xs hover:bg-muted">
						<ListTodo className="size-3.5" />
						<span className="font-normal">To-dos</span>
						<span className="font-light">{`${completedTodos?.length}/${todos?.length}`}</span>
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-2 border-t p-2">
						{todos?.map((todo) => {
							return (
								<div className="flex flex-row items-center gap-2 text-xs" key={todo.id}>
									{iconMap[todo.status]}
									<span className="truncate text-foreground">{todo.content}</span>
								</div>
							);
						})}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</CardContentItem>
	);
}
