import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Timestamp } from "firebase/firestore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import * as React from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { db } from "@/components/FireBase";
import { addDoc, collection } from "firebase/firestore";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateFile() {
  const [title, setTitle] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [date, setDate] = React.useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("Select Status");
  const [selectedPriority, setSelectedPriority] = React.useState<string>("Select Priority");
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  const handleSubmit = async () => {
    if (!title || !date || selectedStatus === "Select Status") {
      return;
    }
  
    try {
      await addDoc(collection(db, "tasks"), {
        title,
        message,
        date: Timestamp.fromDate(date), 
        status: selectedStatus,
        priority: selectedPriority !== "Select Priority" ? selectedPriority : undefined,  
      });
      

      // Reset form and close dialog
      setTitle("");
      setMessage("");
      setDate(null);
      setSelectedStatus("Select Status");
      setSelectedPriority("Select Priority");
      setIsDialogOpen(false);
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Create Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Simplify your workflow and get things done with ease!
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Textarea value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Type your title here." id="title" className="resize-none font-thin" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your message</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message here." id="message" className="font-thin" />
          </div>

          {/* Date Picker shadcnui */}
          <div className="bg-white">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span className="font-thin">Select Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-2 bg-white">
                <Select
                  onValueChange={(value) =>
                    setDate(addDays(new Date(), parseInt(value)))
                  }
                >
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
                <Calendar
                  mode="single"
                  selected={date || undefined}  
                  onSelect={(selectedDate) => setDate(selectedDate ?? null)} 
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sttus selection */}
          <div>
            <Label className="text-lg">Status</Label>
            <Menu as="div" className="relative text-left">
              <div>
                <MenuButton className="inline-flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {selectedStatus}
                  <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                <MenuItem as={Button} className={"w-full hover:bg-slate-100"} onClick={() => setSelectedStatus("ToDo")}>
                  <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ToDo</span>
                </MenuItem>
                <MenuItem as={Button} className={"w-full hover:bg-slate-100"} onClick={() => setSelectedStatus("InProgress")}>
                  <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">In Progress</span>
                </MenuItem>
                <MenuItem as={Button} className={"w-full hover:bg-slate-100"} onClick={() => setSelectedStatus("Completed")}>
                  <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Completed</span>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          {/* priority selection */}
          <div>
            <Label className="text-lg">Priority</Label>
            <Menu as="div" className="relative text-left">
              <div>
                <MenuButton className="inline-flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {selectedPriority}
                  <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                <MenuItem as={Button} className={"w-full hover:bg-slate-100"} onClick={() => setSelectedPriority("High")}>
                  <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">High</span>
                </MenuItem>
                <MenuItem as={Button} className={"w-full hover:bg-slate-100"} onClick={() => setSelectedPriority("Medium")}>
                  <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Medium</span>
                </MenuItem>
                <MenuItem as={Button} className={"w-full hover:bg-slate-100"} onClick={() => setSelectedPriority("Low")}>
                  <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Low</span>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="border-red-700 bg-red-200"
              onClick={() => setIsDialogOpen(false)} 
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-sky-500 hover:bg-sky-700 text-white">
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateFile;