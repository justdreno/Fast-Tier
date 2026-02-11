interface RankedListingProps {
  rank: number;
  username: string;
  avatarUrl?: string;
  className?: string;
}

export default function RankedListing({ 
  rank, 
  username, 
  avatarUrl,
  className = '' 
}: RankedListingProps) {
  return (
    <div className={`relative flex items-center overflow-hidden ${className}`}>
      {/* Gold slanted background */}
      <div 
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ffd700] to-[#ffb800]"
        style={{
          clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)',
          width: '120px'
        }}
      />
      
      {/* Number */}
      <div className="relative z-10 flex items-center justify-center w-16 h-14">
        <span className="text-2xl font-bold text-white drop-shadow-md">
          {rank}.
        </span>
      </div>
      
      {/* Avatar */}
      <div className="relative z-10 ml-auto mr-4">
        <img
          src={avatarUrl || `https://render.crafty.gg/3d/bust/${username}`}
          alt={username}
          className="w-12 h-12 object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://render.crafty.gg/3d/bust/MHF_Alex';
          }}
        />
      </div>
    </div>
  );
}
