import { Container } from "@/shared/components/container"
import { Button } from "@/shared/components/ui/button"

export default function IndexPage() {
  return (
    <Container className="flex min-h-svh py-lg" render={<section />}>
      <div className="flex max-w-md min-w-0 flex-col gap-md text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-xs">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </Container>
  )
}
