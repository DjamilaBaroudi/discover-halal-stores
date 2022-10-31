import { useRouter } from "next/router";
import Link from "next/link";

const HalalStore = () => {
    const router = useRouter();
    return (
        <div>
            <p> This is the page for the store {router.query.id} </p>
            <Link href="/">
                <a>  Back to home </a>
            </Link>
        </div>
    )

}

export default HalalStore;