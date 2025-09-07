import { useContext, useEffect } from "react"
import { DataContext } from "../context/DataContext"

const CaptainDetails = () => {
  const { captain, isLoading, setIsLoading } = useContext(DataContext)

  useEffect(() => {
    if (!captain) setIsLoading(true)
    else setIsLoading(false)
  }, [captain])

  return (
    <div className="p-2 md:p-2 md:pl-6 md:pr-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse-slow">
            <i className="ri-loader-4-line text-2xl text-primary animate-spin"></i>
          </div>
        </div>
      ) : (
        <div className="md:flex items-center justify-between gap-10">
          <div className="md:w-2/5 glass-card p-4 md:p-6 rounded-xl border border-border mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-primary text-xl md:text-2xl"></i>
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-display font-bold text-foreground capitalize">
                    {captain?.fullName?.firstName + " " + captain?.fullName?.lastName}
                  </h4>
                  <p className="text-muted-foreground text-sm md:text-base">Captain</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-xl md:text-2xl font-bold text-primary">₹295.20</h4>
                <p className="text-muted-foreground text-sm">Today's Earnings</p>
              </div>
            </div>
          </div>

          <div className="md:w-3/5 glass-card p-4 md:p-6 rounded-xl border border-border">
            <h5 className="text-lg font-display font-semibold text-foreground mb-3">Today's Stats</h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-primary/10 rounded-xl">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-timer-2-line text-primary text-lg"></i>
                </div>
                <h6 className="text-base md:text-lg font-bold text-foreground">10.2</h6>
                <p className="text-muted-foreground text-xs md:text-sm">Hours Online</p>
              </div>

              <div className="text-center p-3 bg-secondary/10 rounded-xl">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-speed-up-line text-secondary text-lg"></i>
                </div>
                <h6 className="text-base md:text-lg font-bold text-foreground">15</h6>
                <p className="text-muted-foreground text-xs md:text-sm">Trips Completed</p>
              </div>

              <div className="text-center p-3 bg-accent/10 rounded-xl">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-star-line text-accent text-lg"></i>
                </div>
                <h6 className="text-base md:text-lg font-bold text-foreground">4.8</h6>
                <p className="text-muted-foreground text-xs md:text-sm">Rating</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaptainDetails
