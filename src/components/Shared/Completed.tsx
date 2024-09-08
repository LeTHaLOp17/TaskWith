import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"


const Completed = () => {
  const [date, setDate] = React.useState<Date>()
  return (
    <>
     <div className="bg-white border-l-4 border-green-500 rounded-xl cursor-pointer mb-4">
        <Card>
            <CardHeader className="relative">
            <div className="m-2 ml-0.5">
                <p className="bg-green-300 text-white font-semibold pt-3 pl-5 pr-5 pb-3 rounded-xl inline">
                    High
                </p>
            </div>
                <div className="flex items-center">
                    <CardTitle className="text-3xl font-bold flex-grow">BrainStroming</CardTitle>
                    <Menu as="div" className="relative">
                        <div>
                            <MenuButton className="inline-flex w-full justify-left gap-x-1.5 bg-white">
                                <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                            </MenuButton>
                        </div>

                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            <DropdownMenuLabel className="ml-3 mt-3 font-semibold">Change Status</DropdownMenuLabel>
                                      <div className="flex justify-center m-2 -mb-1">
                                    <hr className="border-t border-gray-400 w-11/12" />
                                    </div>
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 font-bold"
                                    >
                                        ToDo
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 font-bold"
                                    >
                                        InProgress
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 font-bold"
                                    >
                                        Completed
                                    </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>
                </div>
            </CardHeader>
            <CardContent>
                <p className="font-normal">BrainStroming is Me ayush kumar patel jkskjdbkbkvnsadkjnkjbvdkjnkjfdnmnbdfnmbgfnb</p>
            </CardContent>
            <div className="flex justify-center mb-4">
                <hr className="border-t border-gray-400 w-11/12" />
            </div>
            <CardFooter>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className={cn(
                                "w-[150px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-3 h-6 w-5" />
                            {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 shadow-none bg-white">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </CardFooter>
        </Card>
    </div>
    </>
  )
}

export default Completed
