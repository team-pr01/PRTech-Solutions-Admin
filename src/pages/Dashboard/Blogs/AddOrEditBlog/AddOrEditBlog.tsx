/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useAddBlogMutation,
  useGetSingleBlogBySlugQuery,
  useUpdateBlogMutation,
} from "../../../../redux/Features/Blogs/blogsApi";
import toast from "react-hot-toast";
import TextInput from "../../../../components/Reusable/TextInput/TextInput";
import SelectDropdown from "../../../../components/Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../../../components/Reusable/TextArea/TextArea";
import Button from "../../../../components/Reusable/Button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiX } from "react-icons/fi";

type TFormData = {
  title: string;
  overview: string;
  category: string;
  description: string;
  imageUrl: FileList | null;
  isFeatured: boolean;
  timeToRead: string;
  tags: string[];
};

// Quill modules configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "check",
  "indent",
  "align",
  "link",
  "image",
  "video",
];

const AddOrEditBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading: isLoadingBlog } = useGetSingleBlogBySlugQuery(slug);
  const blog = data?.data || {};

  const [description, setDescription] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TFormData>({
    defaultValues: {
      title: "",
      overview: "",
      category: "",
      description: "",
      isFeatured: false,
      timeToRead: "",
      tags: [],
      imageUrl: null,
    },
  });

  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const categoryOptions = [
    "Technology",
    "Business",
    "Design",
    "Development",
    "Marketing",
    "Startup",
    "AI & ML",
    "Blockchain",
    "Cybersecurity",
    "Other",
  ];

  // Set default values when editing
  useEffect(() => {
    if (slug && data?.data) {
      const blog = data.data;
      reset({
        title: blog.title || "",
        overview: blog.overview || "",
        category: blog.category || "",
        description: blog.description || "",
        isFeatured: blog.isFeatured || false,
        timeToRead: blog.timeToRead || "",
        tags: blog.tags || [],
        imageUrl: null,
      });
      setDescription(blog.description || "");
      if (blog.imageUrl) {
        setExistingImage(blog.imageUrl);
      }
    }
  }, [slug, data, reset]);

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("imageUrl", files);
    }
  };

  // Remove image
  const removeImage = () => {
    setImagePreview(null);
    setValue("imageUrl", null);
    const input = document.getElementById("imageUrl") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmitBlog = async (data: TFormData) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("title", data.title);
      formData.append("overview", data.overview);
      formData.append("category", data.category);
      formData.append("description", description);
      formData.append("isFeatured", data.isFeatured.toString());
      formData.append("timeToRead", data.timeToRead);
      tags.forEach((tag) => formData.append("tags", tag));

      // Append image file if selected
      if (data.imageUrl && data.imageUrl.length > 0) {
        formData.append("file", data.imageUrl[0]);
      }

      if (slug) {
        // Update existing blog
        const res = await updateBlog({
          id: blog?._id,
          data: formData,
        }).unwrap();
        if (res?.success) {
          toast.success("Blog updated successfully");
          navigate("/dashboard/admin/blogs");
        }
      } else {
        // Add new blog
        const res = await addBlog(formData).unwrap();
        if (res?.success) {
          toast.success("Blog added successfully");
          reset();
          setDescription("");
          setImagePreview(null);
          setExistingImage(null);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
  };

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (isLoadingBlog) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(handleSubmitBlog)} className="space-y-4">
        {/* Title */}
        <TextInput
          label="Title"
          placeholder="Enter blog title"
          error={errors.title}
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title must be at least 5 characters",
            },
          })}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category */}
          <SelectDropdown
            label="Category"
            options={categoryOptions}
            error={errors.category}
            {...register("category", {
              required: "Category is required",
            })}
          />
          <SelectDropdown
            label="Featured Status"
            options={["true", "false"]}
            error={errors.isFeatured}
            {...register("isFeatured", {
              required: "Featured status is required",
            })}
          />
          <TextInput
            label="Time to Read"
            placeholder="e.g. 5 mins"
            error={errors.timeToRead}
            {...register("timeToRead", {
              required: "Time to read is required",
            })}
          />
        </div>

        <div className="space-y-2">
          <TextInput
            name="tags"
            label={"Tags"}
            placeholder={"Enter tags and hit enter to add new"}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            error={errors.tags as any}
            isRequired={false}
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm text-blue-700"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-500 hover:text-red-500 transition"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail Image
          </label>

          {/* Existing Image Preview */}
          {existingImage && !imagePreview && (
            <div className="relative inline-block">
              <img
                src={existingImage}
                alt="Existing blog thumbnail"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => setExistingImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <FiX size={14} />
              </button>
            </div>
          )}

          {/* New Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Blog thumbnail preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <FiX size={14} />
              </button>
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            id="imageUrl"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-10 file:text-white hover:file:bg-primary-20 transition cursor-pointer"
          />
          <p className="text-xs text-gray-400">
            Recommended: JPG, PNG, WebP. Max size: 5MB
          </p>
          {errors.imageUrl && (
            <p className="text-red-500 text-xs mt-1">
              {errors.imageUrl.message as string}
            </p>
          )}
        </div>

        {/* Overview */}
        <Textarea
          label="Overview"
          placeholder="Enter a brief overview of the blog post"
          error={errors.overview}
          {...register("overview", {
            required: "Overview is required",
            minLength: {
              value: 20,
              message: "Overview must be at least 20 characters",
            },
          })}
          rows={3}
        />

        {/* Rich Text Editor - Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={handleDescriptionChange}
            modules={modules}
            formats={formats}
            placeholder="Write your blog content here..."
            className="bg-white rounded-lg"
            style={{ height: "300px", marginBottom: "50px" }}
          />
          {!description && errors.description && (
            <p className="text-red-500 text-xs mt-1">Description is required</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link to="/dashboard/admin/blogs">
            <Button type="button" variant="secondary" label="Cancel" />
          </Link>
          <Button
            type="submit"
            isDisabled={isSubmitting}
            label={
              isSubmitting
                ? !slug
                  ? "Adding..."
                  : "Updating..."
                : !slug
                  ? "Add Blog"
                  : "Update Blog"
            }
          />
        </div>
      </form>
    </div>
  );
};

export default AddOrEditBlog;
