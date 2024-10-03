import { Link } from "react-router-dom";
import notfound from "./../../assets/notFound.jpeg";
function NotFound() {
  return (
    <main className="h-screen relative">
      <img
        src={notfound}
        alt="not found image"
        className=" block w-full h-full object-contain"
      />
      <div className="absolute top-[52%] lg:top-[55%] text-xs sm:text-sm md:text-lg p-5 sm:p-10 left-1/2 -translate-x-1/2 w-full text-center">
        The page you are looking for might have been removed had Its name
        changed cr is temporally unavailable to &nbsp;
        <Link
          className="text-orange-600 border-b-4 border-orange-600 border-dotted text-nowrap"
          to="/"
        >
          home page
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
