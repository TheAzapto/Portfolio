import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Card from "../components/Card";

function Projects() {
    const projects = [
        {
            title: "Bloom Mind",
            description: "Bloom Mind is a platform for mental health and wellness. users can interact with the web application to understand their mental health and get personalized recommendations.",
            image: "",
            link: "#"
        },
        {
            title: "Finnalyze",
            description: "A revolutionary AI-driven application that optimizes workflow efficiency for large enterprises.",
            image: "",
            link: "#"
        }
    ];

    return (
        <div style={{ height: "100vh", width: "100vw", backgroundColor: "black", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 100 }}>
                <Navbar />
            </div>

            <Carousel>
                {projects.map((project, index) => (
                    <Card
                        key={index}
                        title={project.title}
                        description={project.description}
                        image={project.image}
                        link={project.link}
                    />
                ))}
            </Carousel>
        </div>
    )
}

export default Projects