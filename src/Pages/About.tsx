const faqs = [
    {
        uid: '1',
        question: 'Thời gian giao hàng là bao lâu ?',
        answer: 'Thời gian giao hàng thường sẽ từ 2-4 ngày. Nếu qua thời gian này bạn có thể liên hệ để chúng tôi hỗ trợ kiểm tra.'
    },
    {
        uid: '2',
        question: 'Nếu sản phẩm có lỗi thì sao ?',
        answer: 'Bạn nhận hàng vui lòng quay lại video. Nếu lỗi do chúng tôi hay đơn vị vận chuyển, chúng tôi sẽ hỗ trợ bạn đổi trả miễn phí.'
    },
    {
        uid: '3',
        question: 'Câu hỏi ?',
        answer: 'Câu trả lời'
    }
]

export default function About() {
    return (
        <div>
            <h3 className="text-3xl font-medium">Về Chúng Tôi</h3>
            <div className="mt-10">
                <div>
                    <p>Chúng tôi là đơn vị phát hành sách thiếu nhi với quan điểm tiếp cận tiên tiến & nhằm hướng đến nền giáo dục hiện đại, xây dựng bước khởi đầu cho việc hình thành tri thức & cá tính trẻ em. Các ấn phẩm của Chúng tôi lựa chọn đều lấy trẻ em làm đối tượng trung tâm cần hướng đến để đem lại cho các em những trải nghiệm thẩm mỹ, giáo dục, văn hóa, kỹ năng tốt đẹp nhất. Các sản phẩm của Chúng tôi giới thiệu đến độc giả là những đầu sách nổi tiếng tại thị trường Âu Mỹ. Chúng tôi hợp tác bản quyền nội dung từ các nhà xuất bản uy tín như Scholastics, Capstone, Harpercollins, Penguins,... Sách được biên dịch kỹ lưỡng, in ấn với hình thức bìa cứng, chất lượng cao, màu sắc thu hút trẻ em. Ngoài các sách nước ngoài, Chúng tôi còn ấn hành những tác phẩm có chất lượng cao cùng các tác giả và họa sĩ nổi tiếng ở Việt Nam.</p>
                </div>
                <div className="mt-16">
                    <h4 className="text-2xl font-medium">Câu hỏi thường gặp</h4>
                    <div>
                        {faqs.map((faq) => (
                            <div className="grid grid-cols-3 border-b py-6" key={faq.uid}>
                                <p className="font-medium">{faq.question}</p>
                                <span className="col-span-2">{faq.answer}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-16">
                    <strong>Cảm ơn quý khách hàng đã luôn tin tưởng và ủng hộ.</strong>
                </div>
            </div>
        </div>
    )
}