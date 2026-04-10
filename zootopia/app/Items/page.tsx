import Link from "next/link"

const Items = () => {
    return (
        <div>
            <h1>Items</h1>

            <ul className="text-center">
                <li id="explore-btn"><Link href="/Items/1">Item 1</Link></li>
                <li id="explore-btn"><Link href="/Items/2">Item 2</Link></li>
                <li id="explore-btn"><Link href="/Items/3">Item 3</Link></li>
            </ul>

        </div>
    )
}

export default Items