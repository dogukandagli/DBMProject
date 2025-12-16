// testData.ts veya aynı dosyanın içi

import type { BorrowRequestDetailDto } from "./BorrowRequestDetailDto";

export const mockBorrowRequest: BorrowRequestDetailDto = {
  id: "req-101",
  neighborhoodId: 5,
  status: 1, // Open
  createdAt: "2023-10-12T10:00:00Z",
  borrower: {
    id: "user-1",
    fullName: "John Doe",
    profileImageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d", // Rastgele avatar
  },
  itemNeeded: {
    title: "Power Drill - Heavy Duty",
    description:
      "I need to install some heavy-duty shelving in my garage this weekend. My regular drill isn't powerful enough for the concrete walls. Looking for a corded hammer drill or a high-voltage cordless one. I'll take good care of it and can return it by Monday evening!",
    category: "Tools & Home Improvement",
    // Matkap görseli
    imageUrl:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800",
  },
  neededDates: {
    startDate: "2023-10-14T09:00:00Z",
    endDate: "2023-10-16T18:00:00Z",
  },
  actions: {
    canEdit: true,
    canCancel: true,
    canDelete: false,
    canReopen: false,
  },
  offers: [
    {
      id: "offer-1",
      lender: {
        id: "user-2",
        fullName: "Sarah Smith",
        profileImageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      },
      itemImageUrls: [
        "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80&w=200", // Kırmızı matkap
      ],
      description:
        "Hey! I have a DeWalt hammer drill you can use. It's corded, so plenty of power for concrete.",
      handoverMethod: 1, // Drop-off
      condition: 2, // Like New
      status: 3,
      availableDates: {
        startDate: "2023-10-14T08:00:00Z",
        endDate: "2023-10-17T08:00:00Z",
      },
      actions: {
        canAccept: true,
        canReject: true,
      },
      acceptedAt: null,
      createdAt: "2023-10-12T11:30:00Z",
    },
    {
      id: "offer-2",
      lender: {
        id: "user-3",
        fullName: "Mike Ross",
        profileImageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026703d",
      },
      itemImageUrls: [
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80&w=200", // Mavi/Eski matkap
      ],
      description:
        "I'm just a block away. It's an older model but works perfectly fine for shelves.",
      handoverMethod: 0, // Pickup
      condition: 1, // Good
      status: 2,
      availableDates: {
        startDate: "2023-10-14T10:00:00Z",
        endDate: "2023-10-16T20:00:00Z",
      },
      actions: {
        canAccept: false,
        canReject: false,
      },
      acceptedAt: null,
      createdAt: "2023-10-12T13:45:00Z",
    },
    {
      id: "offer-3",
      lender: {
        id: "user-4",
        fullName: "Linda Green",
        profileImageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026709d",
      },
      itemImageUrls: [], // Resimsiz teklif örneği
      description: "Can lend you mine if you still need one. Let me know!",
      handoverMethod: 0, // Pickup
      condition: 0, // Fair
      status: 1,
      availableDates: {
        startDate: "2023-10-14T09:00:00Z",
        endDate: "2023-10-16T18:00:00Z",
      },
      actions: {
        canAccept: true,
        canReject: true,
      },
      acceptedAt: null,
      createdAt: "2023-10-12T15:20:00Z",
    },
  ],
};
