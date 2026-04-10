const ItemDetails = async({ params }: { params: Promise<{ id: string}>}) => {
    const { id } = await params;
    return (
        <div>
            <h1>
                Showing details for item #{id}
            </h1>
        </div>
    )
}

export default ItemDetails