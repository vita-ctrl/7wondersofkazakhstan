import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import NotFoundPage from "../components/NotFound";
import LoadingPage from "../components/LoadingPage";

export default function Booking() {
  const location = useLocation();

  const dateId = location.state?.dateId || null;

  const { tourId } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!dateId) return <NotFoundPage />;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch("/tours/tours.json")
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const tour = tours.find((t) => t.id === tourId);
  if (!tour) return <NotFoundPage />;

  const date = tour.booking.dates.find((t) => t.id === dateId);
  if (!date) return <NotFoundPage />;

  return <BookingDetail dateId={dateId} {...tour.booking} />;
}

function BookingDetail(props) {
  return <>{props.cost}</>;
}
