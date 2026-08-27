import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AiSummary, AiSummaryLabel, AiSummaryText } from "@/components/ui/ai-summary";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@/components/ui/meter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { OTPField, OTPFieldInput } from "@/components/ui/otp-field";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress";
import { Radio } from "@/components/ui/radio";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
} from "@/components/ui/toolbar";
import { Tooltip } from "@/components/ui/tooltip";
import { Category, Meta, Specimen } from "@/showcase/specimen";

const HOSTS = [
  "Sam Whitfield",
  "Marta Nowak",
  "Dan Iverson",
  "Priya Raman",
  "Tom Beck",
];

const LEVELS = ["Level 1", "Level 4", "Level 9", "Rooftop plant"];

function ToastSpecimen() {
  const toast = useToast();
  return (
    <>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Checked in",
            description: "Badge V-2208 · Level 9",
          })
        }
      >
        Checked in
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.nudge({
            id: "permit",
            title: "Permit unsigned",
            description: "Hot works · L4 riser",
          })
        }
      >
        Nudge (no stack)
      </Button>
    </>
  );
}

/* -- 02 · Actions --------------------------------------------------- */

function Actions() {
  return (
    <Category index="02" title="Actions" aside="button at fill">
      <Specimen name="Button · variants" note="Primary is the lane at fill.">
        <Button>Start check-in</Button>
        <Button variant="secondary">Get help</Button>
        <Button variant="ghost">Not me</Button>
        <Button variant="danger">Sign me out</Button>
        <Button disabled>Disabled</Button>
      </Specimen>

      <Specimen name="Button · sizes" align="center">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Specimen>

      <Specimen
        name="Button · cta"
        note="48px on mobile and tablet, stepping down from 1024px up. Resize to see it."
        align="center"
      >
        <Button size="cta">Start check-in</Button>
        <Button size="cta" variant="secondary">
          Get help
        </Button>
      </Specimen>

      <Specimen name="Toggle & toggle group" note="Pressed takes the accent.">
        <Toggle defaultPressed>Escort</Toggle>
        <ToggleGroup
          aria-label="Text size"
          defaultValue={["md"]}
          className="border border-line"
        >
          <Toggle value="sm" aria-label="Small text">
            A
          </Toggle>
          <Toggle value="md" aria-label="Medium text">
            AA
          </Toggle>
          <Toggle value="lg" aria-label="Large text">
            AAA
          </Toggle>
        </ToggleGroup>
      </Specimen>

      <Specimen name="Toolbar" span="half">
        <Toolbar aria-label="Kiosk actions">
          <ToolbarGroup>
            <ToolbarButton>Sign in</ToolbarButton>
            <ToolbarButton>Sign out</ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarLink href="#help">Get help</ToolbarLink>
        </Toolbar>
      </Specimen>

      <Specimen name="Tooltip" align="center">
        <Tooltip content="Reprints the last badge">
          <Button variant="secondary">Reprint badge</Button>
        </Tooltip>
      </Specimen>
    </Category>
  );
}

/* -- 03 · Text & numeric input -------------------------------------- */

function TextInput() {
  return (
    <Category index="03" title="Text & numeric input" aside="focus ring at fill">
      <Specimen name="Input">
        <Input placeholder="Company name" className="w-full" />
      </Specimen>

      <Specimen name="Field" note="Label, control, description.">
        <Field className="w-full">
          <FieldLabel>Who are you here to see?</FieldLabel>
          <FieldControl placeholder="Sam Whitfield" />
          <FieldDescription>
            We notify them the moment you check in.
          </FieldDescription>
        </Field>
      </Specimen>

      <Specimen name="Field · error">
        <Form
          className="w-full"
          onFormSubmit={(_values, eventDetails) => {
            eventDetails.event?.preventDefault?.();
          }}
        >
          <Field name="company">
            <FieldLabel>Company</FieldLabel>
            <FieldControl required placeholder="Kellard Mechanical" />
            <FieldError />
          </Field>
          <Button type="submit" size="sm" className="mt-3">
            Submit empty
          </Button>
        </Form>
      </Specimen>

      <Specimen name="Select">
        <Select defaultValue="Meeting">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Meeting">Meeting</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Delivery">Delivery</SelectItem>
          </SelectContent>
        </Select>
      </Specimen>

      <Specimen name="Combobox" note="Filters a known list.">
        <Combobox items={HOSTS}>
          <ComboboxInput placeholder="Search hosts…" />
          <ComboboxContent>
            <ComboboxEmpty>Nobody by that name.</ComboboxEmpty>
            <ComboboxList>
              {(host: string) => (
                <ComboboxItem key={host} value={host}>
                  {host}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Specimen>

      <Specimen name="Autocomplete" note="Suggests, but accepts anything.">
        <Autocomplete items={LEVELS}>
          <AutocompleteInput placeholder="Where are you working?" />
          <AutocompleteContent>
            <AutocompleteEmpty>No match — type it in.</AutocompleteEmpty>
            <AutocompleteList>
              {(level: string) => (
                <AutocompleteItem key={level} value={level}>
                  {level}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      </Specimen>

      <Specimen name="Number field" note="Visitors in the party.">
        <NumberField defaultValue={2} min={1}>
          <NumberFieldGroup>
            <NumberFieldDecrement>−</NumberFieldDecrement>
            <NumberFieldInput />
            <NumberFieldIncrement>+</NumberFieldIncrement>
          </NumberFieldGroup>
        </NumberField>
      </Specimen>

      <Specimen name="OTP field" note="Host-supplied arrival code.">
        <OTPField length={4}>
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPField>
      </Specimen>

      <Specimen name="Slider" note="Kiosk text size.">
        <Slider defaultValue={40} className="w-full" />
      </Specimen>

      <Specimen name="Fieldset" span="half">
        <Fieldset className="w-full">
          <FieldsetLegend>Contractor details</FieldsetLegend>
          <Field name="company">
            <FieldLabel>Company</FieldLabel>
            <FieldControl placeholder="Kellard Mechanical" />
          </Field>
          <Field name="permit">
            <FieldLabel>Permit number</FieldLabel>
            <FieldControl placeholder="PMT-4471" className="font-mono" />
          </Field>
        </Fieldset>
      </Specimen>
    </Category>
  );
}

/* -- 04 · Choice ---------------------------------------------------- */

function Choice() {
  return (
    <Category index="04" title="Choice" aside="checked at accent">
      <Specimen name="Checkbox">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox defaultChecked />
          Read the site notices
        </label>
        <label className="flex items-center gap-2 text-sm text-fg-subtle">
          <Checkbox disabled />
          Disabled
        </label>
      </Specimen>

      <Specimen name="Checkbox group">
        <CheckboxGroup aria-label="Site inductions" className="w-full">
          {["General induction", "Hot works", "Working at height"].map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <Checkbox name={c} defaultChecked={c === "General induction"} />
              {c}
            </label>
          ))}
        </CheckboxGroup>
      </Specimen>

      <Specimen name="Radio group">
        <RadioGroup defaultValue="Visiting someone" aria-label="Reason">
          {["Visiting someone", "Contractor", "Delivery"].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <Radio value={r} />
              {r}
            </label>
          ))}
        </RadioGroup>
      </Specimen>

      <Specimen name="Switch">
        <label className="flex items-center gap-2 text-sm">
          <Switch defaultChecked />
          Notify my host
        </label>
        <label className="flex items-center gap-2 text-sm text-fg-subtle">
          <Switch disabled />
          Disabled
        </label>
      </Specimen>

      <Specimen name="Selected chip" note="Tint panel, pressed text.">
        <span className="rounded-full bg-lane-tint px-4 py-2 text-sm font-medium text-lane-pressed">
          English
        </span>
        <span className="rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-fg-muted">
          Text size
        </span>
      </Specimen>
    </Category>
  );
}

/* -- 05 · Disclosure & navigation ----------------------------------- */

function Disclosure() {
  return (
    <Category index="05" title="Disclosure & navigation">
      <Specimen name="Tabs" span="half">
        <Tabs defaultValue="visitor" className="w-full">
          <TabsList>
            <TabsTab value="visitor">Visitor</TabsTab>
            <TabsTab value="contractor">Contractor</TabsTab>
            <TabsTab value="staff">Staff</TabsTab>
          </TabsList>
          <TabsPanel value="visitor" className="pt-3 text-sm text-fg-muted">
            Two minutes and a badge; nothing about compliance.
          </TabsPanel>
          <TabsPanel value="contractor" className="pt-3 text-sm text-fg-muted">
            Induction, permits, escort — stated plainly.
          </TabsPanel>
          <TabsPanel value="staff" className="pt-3 text-sm text-fg-muted">
            The house lane: portal and admin surfaces.
          </TabsPanel>
        </Tabs>
      </Specimen>

      <Specimen name="Accordion" span="half">
        <Accordion className="w-full">
          <AccordionItem value="notices">
            <AccordionTrigger>Today's site notices</AccordionTrigger>
            <AccordionPanel>
              Masks on levels 2 and 3. Level 4 lift out until 5pm.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="evac">
            <AccordionTrigger>Where do I go in an evacuation?</AccordionTrigger>
            <AccordionPanel>
              Assembly point is the plaza on the north side of the tower.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Specimen>

      <Specimen name="Collapsible" span="half">
        <Collapsible className="w-full">
          <CollapsibleTrigger>What we do with your details</CollapsibleTrigger>
          <CollapsiblePanel>
            Held for 30 days for emergency roll-call, then deleted.
          </CollapsiblePanel>
        </Collapsible>
      </Specimen>

      <Specimen name="Menubar" span="half">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Kiosk</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Reprint badge</MenubarItem>
              <MenubarItem>Change language</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Call reception</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Site</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Who is on site</MenubarItem>
              <MenubarItem>Evacuation roll-call</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Specimen>

      <Specimen name="Navigation menu" span="half">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Visitors</NavigationMenuTrigger>
              <NavigationMenuContent>
                <p className="text-sm text-fg-muted">
                  Expected today, on site now, and sign-out history.
                </p>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Contractors</NavigationMenuTrigger>
              <NavigationMenuContent>
                <p className="text-sm text-fg-muted">
                  Inductions, permits and escorted works.
                </p>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#settings">Settings</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      </Specimen>

      <Specimen name="Scroll area" note="Roll-call, 20 people on site.">
        <ScrollArea className="h-40 w-full rounded-md border border-line">
          <ScrollAreaViewport>
            <div className="p-3 text-sm">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="flex justify-between py-1.5 font-mono text-[13px]"
                >
                  <span>Badge V-22{String(i).padStart(2, "0")}</span>
                  <span className="text-fg-subtle">L{(i % 9) + 1}</span>
                </div>
              ))}
            </div>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="vertical">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
        </ScrollArea>
      </Specimen>
    </Category>
  );
}

/* -- 06 · Overlays -------------------------------------------------- */

function Overlays() {
  return (
    <Category index="06" title="Overlays" aside="drawn, never floating">
      <Specimen name="Dialog" align="center">
        <Dialog>
          <DialogTrigger render={<Button variant="secondary" />}>
            Confirm details
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-base font-semibold">
              Confirm your details
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-fg-muted">
              We will print a badge and let your host know you have arrived.
            </DialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <DialogClose render={<Button variant="ghost" />}>
                Not me
              </DialogClose>
              <DialogClose render={<Button />}>Yes, that's me</DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </Specimen>

      <Specimen name="Alert dialog" note="Red is the exit." align="center">
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="danger" />}>
            Sign me out
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle className="text-base font-semibold">
              Sign out of Rushcutters Tower?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-fg-muted">
              Your badge stops working and your host is notified.
            </AlertDialogDescription>
            <div className="mt-5 flex justify-end gap-2">
              <AlertDialogClose render={<Button variant="ghost" />}>
                Not yet
              </AlertDialogClose>
              <AlertDialogClose render={<Button variant="danger" />}>
                Sign me out
              </AlertDialogClose>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </Specimen>

      <Specimen name="Drawer" align="center">
        <Drawer>
          <DrawerTrigger render={<Button variant="secondary" />}>
            Site notices
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle className="text-base font-semibold">
              Two notices today
            </DrawerTitle>
            <DrawerDescription className="mt-1 text-sm text-fg-muted">
              Masks on levels 2 and 3. Level 4 lift out until 5pm.
            </DrawerDescription>
            <div className="mt-5 flex justify-end">
              <DrawerClose render={<Button variant="ghost" />}>
                Got it
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </Specimen>

      <Specimen name="Popover" align="center">
        <Popover>
          <PopoverTrigger render={<Button variant="secondary" />}>
            Why we ask
          </PopoverTrigger>
          <PopoverContent>
            <PopoverTitle className="text-sm font-semibold">
              Emergency roll-call
            </PopoverTitle>
            <PopoverDescription className="mt-1 text-sm text-fg-muted">
              We need to know who is in the building if we have to evacuate.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      </Specimen>

      <Specimen name="Menu" align="center">
        <Menu>
          <MenuTrigger render={<Button variant="secondary" />}>
            Kiosk options
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Change language</MenuItem>
            <MenuItem>Larger text</MenuItem>
            <MenuSeparator />
            <MenuItem>Call reception</MenuItem>
            <MenuItem disabled>Admin settings</MenuItem>
          </MenuContent>
        </Menu>
      </Specimen>

      <Specimen name="Context menu" align="center">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-24 w-full items-center justify-center rounded-md border border-dashed border-line text-sm text-fg-subtle">
            Right-click a visitor row
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Notify host again</ContextMenuItem>
            <ContextMenuItem>Reprint badge</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Sign out</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Specimen>

      <Specimen name="Preview card" align="center">
        <PreviewCard>
          <PreviewCardTrigger
            href="#host"
            delay={0}
            className="text-fg underline decoration-line-strong underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-ring"
          >
            Sam Whitfield
          </PreviewCardTrigger>
          <PreviewCardContent>
            <p className="text-sm font-semibold">Sam Whitfield</p>
            <p className="mt-1 text-sm text-fg-muted">
              Level 9 · notified 9:41am · usually at their desk.
            </p>
          </PreviewCardContent>
        </PreviewCard>
      </Specimen>

      <Specimen name="Toast" note="Stacked; nudge updates in place.">
        <ToastSpecimen />
      </Specimen>
    </Category>
  );
}

/* -- 07 · Feedback & status ----------------------------------------- */

function Feedback() {
  return (
    <Category index="07" title="Feedback & status" aside="status is lane-blind">
      <Specimen name="Progress" note="Steps through the flow.">
        <Progress value={50} className="w-full">
          <div className="flex items-center justify-between">
            <ProgressLabel>Step 2 of 4 · induction</ProgressLabel>
            <ProgressValue />
          </div>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </Specimen>

      <Specimen name="Meter" note="A measured quantity, not progress.">
        <Meter value={72} className="w-full">
          <div className="flex items-center justify-between">
            <MeterLabel>Site occupancy</MeterLabel>
            <MeterValue />
          </div>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </Specimen>

      <Specimen name="Banner" note="Status surface: edge, tint and mark.">
        <div className="flex w-full flex-col gap-2.5">
          <Banner>Deleted when you sign out.</Banner>
          <Banner tone="success">Induction valid until 4 Nov.</Banner>
          <Banner tone="danger">Hot works permit unsigned.</Banner>
        </div>
      </Specimen>

      <Specimen name="AI summary" note="Hue derives from --info.">
        <AiSummary className="w-full">
          <AiSummaryLabel>Reception note</AiSummaryLabel>
          <AiSummaryText>
            Third visit this month, always to Level 9 — worth a standing pass.
          </AiSummaryText>
        </AiSummary>
      </Specimen>

      <Specimen name="Status rows" span="full">
        <div className="grid w-full gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 rounded-md bg-notice-tint px-3.5 py-3">
            <span className="size-2 rounded-full bg-notice" />
            <span className="text-sm font-medium text-notice-fg">
              Notice · masks on levels 2–3
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-md bg-(--eco-red-tint) px-3.5 py-3">
            <span className="size-2 rounded-full bg-danger" />
            <span className="text-sm font-medium text-danger">
              Blocked · permit unsigned
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-md bg-(--eco-green-tint) px-3.5 py-3">
            <span className="size-2 rounded-full bg-success" />
            <span className="text-sm font-medium text-success">
              Cleared · induction valid
            </span>
          </div>
        </div>
      </Specimen>
    </Category>
  );
}

/* -- 08 · Display & layout ------------------------------------------ */

function Display() {
  return (
    <Category index="08" title="Display & layout" aside="one hairline weight">
      <Specimen name="Avatar" align="center">
        <Avatar>
          <AvatarFallback>MN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>SW</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>DI</AvatarFallback>
        </Avatar>
      </Specimen>

      <Specimen name="Separator" note="The one hairline weight.">
        <div className="w-full">
          <p className="text-sm text-fg-muted">Visitor</p>
          <Separator className="my-3" />
          <p className="text-sm text-fg-muted">Contractor</p>
        </div>
      </Specimen>

      <Specimen name="Row" note="Icon tile at tint, stroke at base.">
        <div className="flex w-full items-center gap-3.5 rounded-lg border border-line p-3.5">
          <div className="flex size-11 flex-none items-center justify-center rounded-md bg-lane-tint">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-lane-base"
              aria-hidden="true"
            >
              <path d="M4 20V9l8-5 8 5v11" />
              <path d="M9.5 20v-6h5v6" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-semibold">Rushcutters Tower</div>
            <div className="font-mono text-[13px] text-fg-subtle">
              Level 1 lobby · kiosk 02
            </div>
          </div>
        </div>
      </Specimen>

      <Specimen name="Type scale" span="full">
        <div className="flex w-full flex-col gap-3">
          {(
            [
              ["Welcome.", "text-5xl font-bold tracking-[-0.035em]", "Kiosk display · 52 / 700"],
              ["Who are you here to see?", "text-3xl font-semibold tracking-[-0.02em]", "Screen title · 30 / 600"],
              ["Visiting someone", "text-2xl font-semibold tracking-[-0.015em]", "Option row · 24 / 600"],
              ["Meeting, interview or delivery", "text-lg text-fg-muted", "Support · 18 / 400"],
              ["Step 2 of 4 · induction", "font-mono text-[13px] tracking-[0.14em] uppercase text-fg-subtle", "Meta · mono 13 / 0.14em"],
            ] as const
          ).map(([sample, cls, label]) => (
            <div
              key={label}
              className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0"
            >
              <div className={cls}>{sample}</div>
              <Meta>{label}</Meta>
            </div>
          ))}
        </div>
      </Specimen>
    </Category>
  );
}

export function Gallery() {
  return (
    <>
      <Actions />
      <TextInput />
      <Choice />
      <Disclosure />
      <Overlays />
      <Feedback />
      <Display />
    </>
  );
}
