import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/components/FireBase";

export function CreateFile() {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [selectedPriority, setSelectedPriority] = useState("Select Priority");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ title?: string; date?: string; status?: string }>({});

  const handleSubmit = async () => {
    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { title?: string; date?: string; status?: string } = {};
    if (!title) newErrors.title = "Title is required";
    if (!date) newErrors.date = "Date is required";
    if (selectedStatus === "Select Status") newErrors.status = "Status is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Collect form data
    const formData = {
      title,
      message,
      date,
      status: selectedStatus,
      priority: selectedPriority,
    };

    try {
      const collectionPath = selectedStatus.replace(/\s+/g, ""); // e.g., 'ToDo', 'InProgress', 'Completed'
      const docRef = await addDoc(collection(db, collectionPath), formData);
      console.log("Document successfully written with ID: ", docRef.id);

      // Reset to default values
      setTitle("");
      setMessage("");
      setSelectedStatus("Select Status");
      setSelectedPriority("Select Priority");
      setDate(undefined);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Task</Button>
      </DialogTrigger>
      <DialogContent className="s m:max-w-max bg-white">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Simplify your workflow and get things done with ease! "Organize tasks, track progress,
            and achieve your goals effortlessly with our app!"
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message-2">Title</Label>
          <Textarea
            placeholder="Type your title here."
            id="message-2"
            className="resize-none font-thin"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">Your message</Label>
          <Textarea
            placeholder="Type your message here."
            id="message"
            className="font-thin"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="bg-white">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span className="font-thin">DD/MM/YY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2 bg-white">
              <Select onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white">
                  <SelectItem value="0">Today</SelectItem>
                  <SelectItem value="1">Tomorrow</SelectItem>
                  <SelectItem value="3">In 3 days</SelectItem>
                  <SelectItem value="7">In a week</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </div>
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-red-500">{errors.date}</p>}
        </div>

        {/* Status Selection */}
        <div>
          <Label className="text-lg">Status</Label>
          <Menu as="div" className="relative text-left">
            <div>
              <MenuButton className="inline-flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-sm font-this text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {selectedStatus}
                <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
              <div className="py-1">
                <MenuItem onClick={() => setSelectedStatus("ToDo")}>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ToDo</a>
                </MenuItem>
                <MenuItem onClick={() => setSelectedStatus("In Progress")}>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    In Progress
                  </a>
                </MenuItem>
                <MenuItem onClick={() => setSelectedStatus("Completed")}>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Completed
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          {errors.status && <p className="text-red-500">{errors.status}</p>}
        </div>

        {/* Priority Selection */}
        <div>
          <Label className="text-lg">Priority</Label>
          <Menu as="div" className="relative text-left">
            <div>
              <MenuButton className="inline-flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-sm font-this text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {selectedPriority}
                <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
              <div className="py-1">
                <MenuItem onClick={() => setSelectedPriority("High")}>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">High</a>
                </MenuItem>
                <MenuItem onClick={() => setSelectedPriority("Medium")}>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Medium</a>
                </MenuItem>
                <MenuItem onClick={() => setSelectedPriority("Low")}>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Low</a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} className="bg-sky-500 hover:bg-sky-700 text-white">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
