import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase_conf";

export default function ProtectedRoute({ redirectPath = "/", children }) {
	const location = useLocation();
	const [isProtect, setIsProtect] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsProtect(!!user);
		});
		return () => unsubscribe();
	}, []);

	// Still loading auth state
	if (isProtect === null) {
		return null;
	}

	if (isProtect) {
		return <Navigate to={redirectPath} />;
	}

	return children;
}
