import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

const PasswordInput = ({
	className,
	ref,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> }) => {
	const [showPassword, setShowPassword] = React.useState(false);
	const disabled = props.value === "" || props.value === undefined || props.disabled;
	return (
		<div className='relative'>
			<input
				type={showPassword ? "text" : "password"}
				className={cn(
					"flex h-9 w-full rounded-md border border-input bg-transparent py-1 pl-3 pr-11 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
			<Button
				type='button'
				variant='ghost'
				size='sm'
				className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
				onClick={() => setShowPassword((prev) => !prev)}
				disabled={disabled}>
				{showPassword && !disabled ? (
					<Eye className='h-5 w-5' />
				) : (
					<EyeOff className='h-5 w-5' />
				)}
				<span className='sr-only'>{showPassword ? "Hide password" : "Show password"}</span>
			</Button>
		</div>
	);
};

export { Input, PasswordInput }
