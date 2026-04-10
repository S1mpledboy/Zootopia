'use client';

const ItemsBtn = () => {
    return (
        <button type="button" id="explore-btn" className="mx-auto" onClick={() => console.log("CLICK")}>
            <a href="/Items">
                Items
            </a>
        </button>
    )
}

export default ItemsBtn
