import { Button, Badge, Input, Textarea } from "@/components/ui/primitives";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";

export default function UIPage() {
  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">UI Components</h1>
        <p className="text-muted-foreground">
          Design system preview and theme tokens
        </p>
      </header>

      {/* Colors */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Colors</h2>
        <div className="flex flex-wrap gap-3">
          <ColorSwatch name="Primary" className="bg-primary text-primary-foreground" />
          <ColorSwatch name="Secondary" className="bg-secondary text-secondary-foreground" />
          <ColorSwatch name="Accent" className="bg-accent text-accent-foreground" />
          <ColorSwatch name="Muted" className="bg-muted text-muted-foreground" />
          <ColorSwatch name="Card" className="bg-card text-card-foreground border" />
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Badges</h2>
        <div className="flex gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-3 max-w-md">
        <h2 className="text-lg font-medium">Inputs</h2>
        <Input placeholder="Input field" />
        <Textarea placeholder="Textarea" />
      </section>

      {/* Card */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Card</h2>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>
              This is a reusable dashboard card.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Card content goes here.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

/* ---------- helper ---------- */

function ColorSwatch({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div
      className={`h-12 w-28 rounded-md grid place-items-center text-sm font-medium ${className}`}
    >
      {name}
    </div>
  );
}
