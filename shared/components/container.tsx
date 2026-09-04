import { useRender } from "@base-ui/react"
import { cn } from "cn"

type ContainerProps<T extends React.ElementType = "div"> =
  useRender.ComponentProps<T>

export function Container<T extends React.ElementType = "div">({
  className,
  render = (<div />) as React.ReactElement,
  ...props
}: ContainerProps<T>) {
  return useRender({
    render,
    props: {
      ...props,
      className: cn("mx-auto max-w-7xl px-md sm:px-lg lg:px-xl", className),
    },
  })
}
