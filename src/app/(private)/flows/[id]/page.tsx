import TabController from "./_components/tab-controller";

export default async function FlowsPage() {
    //fetch data
    return (
        <div className="bg-white h-screen w-full ">
            <div className="flex items-center justify-center py-8">
                <TabController />
            </div>
        </div>
    )
}
