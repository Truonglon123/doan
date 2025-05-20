import { Link } from "react-router-dom"

const Partners = [
    {
        name: 'vinschool',
        imgUrl: './20230816_6C2RcpNc.jpeg',
        link: '',
    },
    {
        name: 'merrystar',
        imgUrl: './20230816_QDDZ5RmU.png',
        link: '',
    },
    {
        name: 'marriott',
        imgUrl: './20230816_eXjduJLQ.png',
        link: '',
    },
]

const Partner = () => {
  return (
    <section className="mb-12">
        <h3 className="text-3xl font-medium">Đối tác</h3>
        <div className="flex gap-6 items-center justify-center mt-6">
            {Partners.map((partner) => (
                <Link to={partner.link} key={partner.link}>
                    <img src={partner.imgUrl} alt={partner.name} className="w-52" loading="lazy" />
                </Link>
            ))}
        </div>
    </section>
  )
}

export default Partner