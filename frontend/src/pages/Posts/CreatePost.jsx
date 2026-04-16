import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CreateBlog from "../../components/BlogComponents/CreateBlog";

function CreatePost() {
    const { id } = useParams();

    return (
        <>
            <div className="w-full h-screen flex flex-col">
                <CreateBlog id={id} />
            </div>
        </>
    );
}

export default CreatePost;
