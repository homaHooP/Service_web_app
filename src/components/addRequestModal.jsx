import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {getCategories, addRequest} from "../api/requestApi.js";

const pr = ["low", "medium", "high"];

const createSchema = z.object({
    title: z
        .string()
        .min(8, "title must be at least 8 characters")
        .max(50, "title can contain 50 characters maximum"),

    description: z
        .string()
        .min(30, "description must be at least 30 characters")
        .max(300, "description can contain 300 characters maximum"),

    priority: z
        .string()
        .min(1, "select a priority"),

    category: z
        .string()
        .min(1, "select a category"),
});

function Modal({setIsModalOpen, setRequests}) {
    const [categories, setCategories] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm({
        resolver: zodResolver(createSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "",
            category: ""
        }
    });

    useEffect(() => {
        async function fetchCategories() {
            try{
                let response = await getCategories();
                setCategories(response.data);
            }
            catch (error){
                setError("root", {
                    message:
                    error.message
                });
            }
        }
        fetchCategories();
    },[setError]);

    async function onSubmit(data) {
        try{
            let resp = await addRequest(data);
            setRequests((prev)=>[...prev,resp.data]);
            setIsModalOpen(false);
        }
        catch (error){
            setError("root", {
                message:
                error.message
            });
        }
    }

    return (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal login-card" onClick={(e) => e.stopPropagation()}>
                <form className="login-fields" onSubmit={handleSubmit(onSubmit)}>
                    <h2>Create a request</h2>
                    <input {...register("title")} type="text" className="login-input" placeholder="Enter title"/>
                    <textarea {...register("description")} className="login-input description-input" placeholder="description here"/>
                    <select {...register("priority")}>
                        <option value="">Select priority</option>
                        {pr.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                    <select {...register("category")}>
                        <option value="">Select category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {(errors.root || errors.title || errors.description || errors.priority || errors.category) && (
                        <div className="error-box">
                            <p className="error-box-text">
                                {errors.root? errors.root.message:
                                    errors.title? errors.title.message:
                                        errors.description? errors.description.message:
                                            errors.priority? errors.priority.message:
                                                errors.category.message
                                }
                            </p>
                        </div>
                    )}
                    <button
                        type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? "..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Modal;