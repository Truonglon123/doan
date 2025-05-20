import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import ProductApi from "@/api/Product";
import { Link } from "react-router-dom";
import formatVND from "@/Helpers/FormatVND";

const Search = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLDivElement | null>(null); // Tham chiếu đến container

    const fetchBooks = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setBooks([]);
            setLoading(true);
            return;
        }

        try {
            const response = await ProductApi.searchProduct(searchQuery);
            setBooks(response.data);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm sách:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            fetchBooks(query);
        }, 2000);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [query]);

    // Sự kiện đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setQuery(""); // Ẩn danh sách khi click ra ngoài
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="max-w-md mx-auto relative" ref={searchRef}>
            <Input
                type="text"
                placeholder="Nhập tên sách..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 border rounded-md"
            />

            {/* Ẩn ul nếu query rỗng */}
            {query && (
                <ul className="mt-4 absolute bg-white shadow-lg w-96 right-0 p-3 rounded-lg z-20">
                    {loading && <p className="mt-2 text-gray-500">Đang tìm kiếm...</p>}
                    {books.length > 0 ? (
                        books.map((book: any) => (
                            <Link to={`/product/${book.slug}`} key={book.id} className="p-2 border-b text-start w-full flex gap-3">
                                <img src={book.images[0]?.src} alt={book.name} className="w-20" />
                                <div className="flex flex-col justify-between w-full">
                                    {book.name}
                                    <div className="flex gap-2 justify-between">
                                        {book.price ? (
                                            <>
                                                <p>Giá: <span className="text-red-500 font-medium">{formatVND(book.price)}</span></p>
                                                <p className="line-through">{formatVND(book.regular_price)}</p>
                                            </>
                                        ) : (
                                            <p>Giá: <span className="text-red-500 font-medium">{formatVND(book.regular_price)}</span></p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        !loading && <p className="mt-2 text-red-500">Không tìm thấy sách</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Search;
