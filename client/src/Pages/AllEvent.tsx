import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { FaPlus } from "react-icons/fa"
import EventCard from "../components/EventCard"
import { useAppSelector } from "../hooks"
import Loader from "../components/Loader"
const AllEvent = () => {
  const navigate = useNavigate()

  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.user,
  )
  // console.log(user)
  if (loading) return <Loader />
  if (!isAuthenticated || !user)
    return <div>Please Login to view this page</div>

  const events = [...user.events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )

  return (
    <div className="px-4 mx-auto flex flex-col justify-between h-[82.5dvh] ">
      <div className="mt-2">
        <div className="text-2xl pl-1 font-bold text-slate-700">
          Hello, {user.name} 👋
        </div>
        <div className="text-slate-600 pl-1 pb-1">
          Here are your upcoming Events
        </div>

        {events.length === 0 ? (
          <div className="text-center italic text-xl px-4  text-gray-500 h-[40vh] flex items-center justify-center">
            No events to show, Create your first event
          </div>
        ) : (
          events.map((event) => (
            <div className="mt-2 flex flex-col gap-2" key={event._id}>
              <EventCard event={event} />
            </div>
          ))
        )}
      </div>
      <div className="mt-auto">
        <Button
          text="Create an Event"
          icon={<FaPlus />}
          onClick={() => navigate("/events/create")}
        />
      </div>
    </div>
  )
}

export default AllEvent
