namespace Domain.Neighborhoods
{
    public class NeighborhoodEdge
    {
        public int Id { get; private set; }

        public int FromNeighborhoodId { get; private set; }
        public int ToNeighborhoodId { get; private set; }

        public double DistanceKm { get; private set; }

        public bool IsBidirectional { get; private set; } = true;

        private NeighborhoodEdge() { }

        public NeighborhoodEdge(int fromId, int toId, double distanceKm, bool isBidirectional = true)
        {
            FromNeighborhoodId = fromId;
            ToNeighborhoodId = toId;
            DistanceKm = distanceKm;
            IsBidirectional = isBidirectional;
        }
    }
}
