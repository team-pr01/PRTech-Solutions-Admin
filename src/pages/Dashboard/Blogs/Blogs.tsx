/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiTag,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDeleteBlogMutation, useGetAllBlogsQuery } from "../../../redux/Features/Blogs/blogsApi";
import type { TableHead } from "../../../components/Reusable/Table/Table";
import { formatDate } from "../../../utils/formatDate";
import Button from "../../../components/Reusable/Button/Button";
import Table from "../../../components/Reusable/Table/Table";
import Modal from "../../../components/Reusable/Modal/Modal";
import AddOrEditBlog from "./AddOrEditBlog/AddOrEditBlog";
import Category from "../../../components/Reusable/Category/Category";
import { useGetAllCategoriesByAreaNameQuery } from "../../../redux/Features/Categories/categoriesApi";

export type TBlog = {
  _id: string;
  imageUrl: string;
  title: string;
  slug: string;
  overview: string;
  category: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Blogs = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [isAddOrEditBlogModalOpen, setIsAddOrEditBlogModalOpen] =
    useState<boolean>(false);

    const {data:categories} = useGetAllCategoriesByAreaNameQuery("blog");

  const { data, isLoading, isFetching, refetch } = useGetAllBlogsQuery({
    page,
    skip,
    limit,
    keyword: searchQuery,
    category: categoryFilter,
  });

  console.log(data);

  const [deleteBlog] = useDeleteBlogMutation();

  // Table headers
  const blogTableHeaders: TableHead[] = [
    { key: "image", label: "Image" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "overview", label: "Overview" },
    { key: "createdAt", label: "Created Date" },
  ];

  const handleDeleteBlog = async (blogId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      toast.promise(
        (async () => {
          const result = await deleteBlog(blogId).unwrap();
          await refetch();
          return result;
        })(),
        {
          loading: `Deleting blog "${title}"...`,
          success: `Blog "${title}" deleted successfully`,
          error: (error: any) =>
            error?.data?.message || "Failed to delete blog",
        },
      );
    }
  };

  // Format table data
  const tableData = data?.data?.data?.map((blog: TBlog) => ({
    ...blog,
    _id: blog._id,
    slug: blog.slug,

    // Column: Image
    image: (
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
        {blog.imageUrl ? (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiImage className="text-gray-400" size={24} />
          </div>
        )}
      </div>
    ),

    // Column: Title
    title: (
      <div className="space-y-1 max-w-[200px]">
        <p className="font-semibold text-gray-800 truncate">{blog.title}</p>
        <p className="text-xs text-gray-400 truncate">Slug: {blog.slug}</p>
      </div>
    ),

    // Column: Category
    category: (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
        <FiTag size={12} />
        {blog.category}
      </span>
    ),

    // Column: Overview
    overview: (
      <p className="text-sm text-gray-600 line-clamp-2 max-w-[250px]">
        {blog.overview}
      </p>
    ),

    // Column: Created Date
    createdAt: formatDate(blog.createdAt as any),
  }));

  // Actions
  const actions: any[] = [
    {
      label: "View Details",
      icon: <FiEye className="inline text-blue-600" />,
      onClick: (row: any) => {
        navigate(`/dashboard/admin/blog/${row._id}`);
      },
    },
    {
      label: "Edit Blog",
      icon: <FiEdit2 className="inline text-green-600" />,
      onClick: (row: any) => {
        navigate(`/dashboard/admin/blog/${row.slug}`, );
        setModalType("edit");
        setIsAddOrEditBlogModalOpen(true);
      },
    },
    {
      label: "Delete Blog",
      icon: <FiTrash2 className="inline text-red-600" />,
      onClick: (row: any) => {
        handleDeleteBlog(row._id, row.title.props.children[0].props.children);
      },
    },
  ];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  // Category filter dropdown (you can make this dynamic from categories API)
  const categoryFilterDropdown = (
    <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">All Categories</option>
        {categories?.data?.map((category: any) => (
          <option key={category?.category} value={category?.category}>
            {category?.category}
          </option>
        ))}
      </select>
  );

  // Combine filters
  const filters = (
    <>
      {categoryFilterDropdown}
      <Button
        onClick={() => {
          setCategoryFilter("");
          setSearchQuery("");
        }}
        label={"Clear Filters"}
      />
      <Button
        onClick={() => {
          navigate("/dashboard/admin/blog");
        }}
        label={"Add Blog"}
      />
      <Category areaName="blog" />
    </>
  );

  return (
    <div>
      <Table<any>
        title={`All Blogs (${data?.data?.meta?.total || 0})`}
        description="Manage your blog posts, create new content, and track published articles"
        theads={blogTableHeaders}
        data={tableData || []}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={actions}
        limit={limit}
        setLimit={setLimit}
        children={filters}
        selectedCity={null}
        selectedArea={null}
      />

      <Modal
        heading={modalType === "add" ? "Add Blog" : "Edit Blog"}
        isModalOpen={isAddOrEditBlogModalOpen}
        setIsModalOpen={setIsAddOrEditBlogModalOpen}
      >
        <AddOrEditBlog
        />
      </Modal>
    </div>
  );
};

export default Blogs;