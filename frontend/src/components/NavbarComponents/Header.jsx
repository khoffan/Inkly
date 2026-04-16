import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-inkly.png";
import UserMenu from "./Usermenu";
import Authbutton from "./Authbutton";
import useBlogStore from "../../store/useBlogStore";
import { useState } from "react";

function Header({
  dropdownRef,
  isCreateBlog,
  isLogin,
  user = {},
  publicState,
  handleDropdown,
  isImage,
  isDropdown,
  handleCheckLogin,
  handleLogout,
  handleProfileNavigate,
  handleToWriteBlog,
  handleToBlogPage,
  toggleSearch,
  isSearchOpen,
}) {
  const { searchQuery, setSearchQuery } = useBlogStore();
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearching = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchParams = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmed = searchInput.trim();
      setSearchQuery(trimmed);
      const params = new URLSearchParams();
      params.set("search", trimmed);
      window.location.href = `?${params.toString()}`;
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-[100]">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between px-4 md:px-6 py-3 min-h-[64px]">
        {/* Logo & Search Area */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/">
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity min-h-[44px] min-w-[44px] justify-center">
              {/* Using a generic crisp dot for logo if image isn't great, else use the image */}
              <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white font-serif font-bold italic text-lg md:text-xl leading-none">
                I
              </div>
              <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-gray-900 hidden sm:block">
                Inkly
              </span>
            </div>
          </Link>
          {!isCreateBlog && (
            <div className="hidden md:flex items-center gap-2 rounded-full bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors px-4 py-2 w-[240px] lg:w-[320px] min-h-[44px]">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-gray-400 text-sm"
              />
              <input
                className="w-full bg-transparent text-sm md:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                id="search"
                name="search"
                type="text"
                placeholder="Search stories, topics, or authors..."
                value={searchInput}
                onChange={handleSearching}
                onKeyDown={handleSearchParams}
              />
            </div>
          )}
          {!isCreateBlog && (
            <button
              className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
              onClick={toggleSearch}
              aria-label="Toggle Search"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          )}
        </div>

        {/* Navigation & Auth */}
        <div className="flex items-center gap-2 md:gap-4">
          {isCreateBlog && user != null && (
            <span className="text-sm text-gray-500 hidden sm:block mr-2 truncate max-w-[150px]">
              Draft by {user.first_name}
            </span>
          )}

          {isLogin ? (
            <UserMenu
              dropdownRef={dropdownRef}
              handleDropdown={handleDropdown}
              handleProfileNavigate={handleProfileNavigate}
              handleLogout={handleLogout}
              handleToWriteBlog={handleToWriteBlog}
              handleToBlogPage={handleToBlogPage}
              isDropdown={isDropdown}
              isImage={isImage}
              user={user}
              isCreateBlog={isCreateBlog}
              publicState={publicState}
            />
          ) : (
            <Authbutton handleCheckLogin={handleCheckLogin} />
          )}
        </div>
      </div>

      {/* Mobile Search Expand */}
      {!isCreateBlog && isSearchOpen && (
        <div className="md:hidden w-full px-4 py-3 border-t border-gray-100 bg-gray-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 min-h-[48px]">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-gray-400"
            />
            <input
              className="w-full bg-transparent text-base text-gray-800 placeholder-gray-400 focus:outline-none"
              id="search-mobile"
              name="search"
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={handleSearching}
              onKeyDown={handleSearchParams}
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
