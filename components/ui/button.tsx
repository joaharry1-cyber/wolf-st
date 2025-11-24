import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={className}
      {...props}
    />
  );
}

export default Button;