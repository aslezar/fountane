import { useEffect, useState } from "react"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import Button from "@/components/Button"
import { FaPlusCircle } from "react-icons/fa"
import { OtherUserType } from "@/definitions"
import Loader from "@/components/Loader"
import { useEventContext } from "@/context/EventContext"
import { useParams } from "react-router-dom"
import { Avatar, ListItemAvatar } from "@mui/material"

const InviteGuests = () => {
  const [selectedGuests, setSelectedGuests] = useState<OtherUserType[]>([])

  const { event, loadingEvent } = useEventContext()
  const { subEventId } = useParams()

  useEffect(() => {
    if (!event) return
    if (!subEventId) return
    const userList = event.userList
      .filter((user) => user.subEvents.includes(subEventId))
      .map((guest) => guest.user)

    setSelectedGuests(userList)
  }, [event, loadingEvent, subEventId])

  const handleGuestChange = (guest: OtherUserType) => {
    setSelectedGuests((prevSelectedGuests) =>
      prevSelectedGuests.some((user) => user._id === guest._id)
        ? prevSelectedGuests.filter((user) => user._id !== guest._id)
        : [...prevSelectedGuests, guest],
    )
  }

  if (loadingEvent) return <Loader />
  if (!event) return <div>No Event Found</div>
  if (!subEventId) return <div>No SubEvent Found</div>

  const userList = event.userList.map((guest) => guest.user)

  return (
    <div className="px-2 my-2 mb-8 flex flex-col h-[85vh] justify-between">
      <div>
        <div className="text-2xl px-3 font-semibold text-zinc-800">
          Invite Guests for the Festivity
        </div>
        <List>
          {userList.map((guest) => (
            <ListItem
              key={guest._id}
              // className="flex flex-col !text-left !items-start"
            >
              <ListItemAvatar>
                <Avatar src={guest.profileImage} className="mr-3">
                  {guest.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={guest.name}
                secondary={
                  <span>
                    Email: {guest.email}
                    <br />
                    PhoneNo: {guest.phoneNo}
                  </span>
                }
                secondaryTypographyProps={{ className: "pl-1" }}
              />
              <Checkbox
                color="secondary"
                edge="end"
                checked={selectedGuests.some((user) => user._id === guest._id)}
                onChange={() => handleGuestChange(guest)}
              />
            </ListItem>
          ))}
        </List>
      </div>
      <Button
        text="Save Selected Guests"
        onClick={() => {}}
        icon={<FaPlusCircle />}
      />
    </div>
  )
}

export default InviteGuests
