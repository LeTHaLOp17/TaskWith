import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import * as React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { db } from "@/components/FireBase"; // Import Firebase config
import { addDoc, collection } from "firebase/firestore";
import { Calendar } from "@/components/ui/calendar"; // Your calendar component if available
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateFile() {
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [date, setDate] = React.useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState("Select Status");
  const [selectedPriority, setSelectedPriority] = React.useState("Select Priority");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleSubmit = async () => {
    if (!title || !date) {
      alert("Title and Date are required.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title,
        message,
        date: format(date, "PPP"), // Format date
        status: selectedStatus,
        priority: selectedPriority,
      });

      console.log("Document written with ID: ", docRef.id);

      // Reset form fields
      setTitle("");
      setMessage("");
      setDate(null);
      setSelectedStatus("Select Status");
      setSelectedPriority("Select Priority");
      
      // Close the dialog
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Create Task</Button>
          </DialogTrigger>
          <DialogContent className="s m:max-w-max bg-white">
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

            {/* Date Picker */}
            <div className="bg-white">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span className="font-thin">DD/MM/YY</span>}
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
                    selected={date}
                    onSelect={setDate} // Set the selected date
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Selection */}
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
                  <MenuItem onClick={() => setSelectedStatus("ToDo")}>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ToDo</span>
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedStatus("In Progress")}>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">In Progress</span>
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedStatus("Completed")}>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Completed</span>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            {/* Priority Selection */}
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
                  <MenuItem onClick={() => setSelectedPriority("High")}>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">High</span>
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedPriority("Medium")}>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Medium</span>
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedPriority("Low")}>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Low</span>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            <DialogFooter>
              <div>
                <Button
                  variant="outline"
                  className="border-red-700 bg-red-200"
                  onClick={() => setIsDialogOpen(false)} // Close the dialog
                >
                  Cancel
                </Button>
              </div>
              <Button onClick={handleSubmit} className="bg-sky-500 hover:bg-sky-700 text-white">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
export default CreateFile
