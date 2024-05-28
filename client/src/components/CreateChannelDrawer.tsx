import React, { useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import Checkbox from "@mui/material/Checkbox"
import Button from "../components/Button"
import { FaPlus } from "react-icons/fa"
import { IoIosCloseCircle } from "react-icons/io"
import { indigo } from "@mui/material/colors" // Import the indigo color
import { useEventContext } from "@/context/EventContext"
import { Loader } from "lucide-react"
import { createSubEventChannel } from "@/api"
import toast from "react-hot-toast"
import { Navigate, useNavigate, useParams } from "react-router-dom"

type Props = {
  toggleDrawer: (arg: boolean) => (arg2: any) => void
}

const CreateChannelDrawer = ({ toggleDrawer }: Props) => {
  const [channelName, setChannelName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [filterRole, setFilterRole] = useState<"all" | "vendor" | "guest">(
    "all",
  )

  const navigate = useNavigate()
  const { eventId, subEventId } = useParams()

  const { event, loadingEvent, updateEvent } = useEventContext()

  useEffect(() => {
    const host = event?.userList.find((user) => user.role === "host")
    if (host) {
      setSelectedUsers([host._id])
    }
  }, [event])

  if (!eventId) return <Navigate to="/events" />
  if (!subEventId) return <Navigate to={`/events/${eventId}`} />
  if (loadingEvent) return <Loader />
  if (!event) return <div>Event Not Found</div>

  const { userList } = event

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleUserSelect = (userId: string) => {
    //if user is host then return
    if (userList.find((user) => user.user._id === userId)?.role === "host") {
      return
    }
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleCreateChannel = () => {
    console.log("Create Channel")
    if (channelName === "") {
      return toast.error("Channel Name is required", { id: "channelName" })
    }
    toast.promise(
      createSubEventChannel(eventId, subEventId, {
        name: channelName,
        allowedUsers: selectedUsers,
      }),
      {
        loading: "Creating Festivity",
        success: (data: { data: { channelId: string } }) => {
          updateEvent()
          navigate(`channel/${data.data.channelId}`)
          return "Channel Created"
        },
        error: (err) => {
          console.log(err)
          return "Failed to create Channel"
        },
      },
    )
  }

  let filteredUsers = userList.filter(
    (user) =>
      user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  switch (filterRole) {
    case "vendor":
      filteredUsers = userList.filter((user) => user.role === "vendor")
      break
    case "guest":
      filteredUsers = userList.filter((user) => user.role === "guest")
      break
  }

  return (
    <div className="h-[90vh] px-3 py-2 pb-8">
      <button
        onClick={toggleDrawer(false)}
        className="flex w-full justify-end "
      >
        <IoIosCloseCircle className="text-3xl text-red-500" />
      </button>
      <TextField
        label="Channel Name"
        variant="outlined"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        fullWidth
        className="!mb-3 !mt-2"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: indigo[600],
            },
            "&:hover fieldset": {
              borderColor: indigo[800],
            },
            "&.Mui-focused fieldset": {
              borderColor: indigo[900],
            },
          },
        }}
      />
      <TextField
        label="Search Vendors, Guests"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        className="!mb-3 !mt-2"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: indigo[600],
            },
            "&:hover fieldset": {
              borderColor: indigo[800],
            },
            "&.Mui-focused fieldset": {
              borderColor: indigo[900],
            },
          },
        }}
      />
      <div className="mb-3 flex justify-center w-full gap-2 px-2">
        <button
          onClick={() => setFilterRole("all")}
          className={`mr-2 w-1/3 ${
            filterRole === "all"
              ? "rounded-full py-1.5 bg-indigo-500 text-white"
              : "outlined"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterRole("vendor")}
          className={`mr-2 w-1/3 ${
            filterRole === "vendor"
              ? "rounded-full py-1.5 bg-indigo-500 text-white"
              : "outlined"
          }`}
        >
          Vendors
        </button>
        <button
          onClick={() => setFilterRole("guest")}
          className={`mr-2 w-1/3 ${
            filterRole === "guest"
              ? "rounded-full py-1.5 bg-indigo-500 text-white"
              : "outlined"
          }`}
        >
          Guests
        </button>
      </div>
      <List className="h-[60vh] overflow-y-auto">
        {filteredUsers.map((user) => (
          <ListItem
            key={user._id}
            secondaryAction={
              <Checkbox
                edge="end"
                disabled={user.role === "host"}
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelect(user._id)}
                sx={{
                  color: indigo[600],
                  "&.Mui-checked": {
                    color: indigo[600],
                  },
                }}
              />
            }
          >
            <ListItemAvatar>
              <Avatar src={user.user.profileImage}>{user.user.name[0]} </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.user.name}
              secondary={
                <div>
                  <span>{user.user.email}</span>
                  <span className="capitalize"> - {user.role}</span>
                </div>
              }
            />
          </ListItem>
        ))}
      </List>

      <Button
        text="Create Channel"
        onClick={handleCreateChannel}
        icon={<FaPlus />}
      />
    </div>
  )
}

export default CreateChannelDrawer
