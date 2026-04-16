import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import useAuthStore from "../../store/useAuthStore";

function Nav({ isCreateBlog, publicState }) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isDropdown, setIsDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const { user, isLogin, isImage, initAuth, logout } = useAuthStore();
	const navigate = useNavigate();

	const toggleSearch = () => {
		setIsSearchOpen(!isSearchOpen);
	};

	useEffect(() => {
		const unsubscribe = initAuth();
		return () => unsubscribe && unsubscribe();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdown(false);
			}
		};

		if (isDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isDropdown]);

	console.log("user", user);
	const handleProfileNavigate = () => {
		if (isLogin) {
			navigate(`/user/profile/`);
		} else {
			navigate("/login");
		}
	};

	const handleToWriteBlog = () => {
		if (isLogin && user) {
			navigate(`/create-blog/${user.authid}`);
		} else {
			navigate("/");
		}
	};

	const handleToBlogPage = () => {
		if (isLogin && user) {
			navigate(`/blog/${user.authid}`);
		} else {
			navigate("/");
		}
	};

	const handleCheckLogin = () => {
		if (!isLogin) {
			navigate("/login");
		}
	};

	const handleDropdown = () => {
		setIsDropdown(!isDropdown);
	};

	const handleLogout = async () => {
		const result = await logout();
		if (result.success) {
			setTimeout(() => {
				navigate("/");
			}, 500);
		}
	};

	return (
		<Header
			dropdownRef={dropdownRef}
			handleCheckLogin={handleCheckLogin}
			handleDropdown={handleDropdown}
			handleLogout={handleLogout}
			handleProfileNavigate={handleProfileNavigate}
			handleToWriteBlog={handleToWriteBlog}
			handleToBlogPage={handleToBlogPage}
			publicState={publicState}
			isCreateBlog={isCreateBlog}
			isDropdown={isDropdown}
			isImage={isImage}
			isLogin={isLogin}
			user={user}
			toggleSearch={toggleSearch}
			isSearchOpen={isSearchOpen}
		/>
	);
}

export default Nav;
