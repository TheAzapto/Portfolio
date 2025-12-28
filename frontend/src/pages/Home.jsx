import '../style/home.css'
import TiltedCard from '../components/TiltedCard'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const overlayContent = (
    <div>
        <h1 className="text-overlay">AAYUSH DUTTA</h1>
    </div>
)

export default function Home() {

    const navigate = useNavigate();

    const [imageHeight, setImageHeight] = useState(window.innerHeight * 0.8 * 0.8);
    const [imageWidth, setImageWidth] = useState(window.innerWidth * 0.4 * 0.8);
    useEffect(() => {
        const handleResize = () => {
            setImageHeight(window.innerHeight * 0.8 * 0.8);
            setImageWidth(window.innerWidth * 0.4 * 0.8);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return (
        <div className='HomeWrapper'>
            <div className="text-center">
                <div className="text-holder">
                    <h1 className="text-4xl font-bold">Welcome</h1>
                    <p className="text-2xl">to my portfolio</p>
                </div>
                <div className="button-holder">
                    <button onClick={() => navigate('/project')}>Projects</button>
                    <button onClick={() => navigate('/chat')}>Chat with me</button>
                </div>
            </div>
            <div className="cardHolder" onClick={() => navigate('/about')}>
                <TiltedCard
                    imageSrc="/images/me.webp"
                    captionText=""
                    containerHeight={imageHeight}
                    containerWidth={imageWidth}
                    imageHeight={imageHeight}
                    imageWidth={imageWidth}
                    scaleOnHover={1.1}
                    rotateAmplitude={15}
                    showMobileWarning={false}
                    showTooltip={false}
                    overlayContent={overlayContent}
                    displayOverlayContent={true}
                />

            </div>
        </div>
    )
}