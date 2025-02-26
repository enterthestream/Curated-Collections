import {
  fetchArtworksMet,
  fetchArtworksVA,
  fetchCombinedArtworks,
  metApi,
  vaApi,
} from "@/api/api";
import axiosMockAdapter from "axios-mock-adapter";
describe("Search Museum API", () => {
  const vaMock = new axiosMockAdapter(vaApi);
  const metMock = new axiosMockAdapter(metApi);

  describe("GET: V&A Museum API functions", () => {
    afterEach(() => {
      vaMock.reset();
    });
    it("searches V&A artworks successfully with 200 status response", async () => {
      const mockData = {
        records: [
          {
            systemNumber: "23",
            _primaryTitle: "Klint painting",
          },
        ],
      };
      vaMock.onGet(`/search?q=klint&page=1&page_size=10`).reply(200, mockData);

      const result = await fetchArtworksVA("klint");

      expect(result).toEqual(mockData);
    });
    it("handles network errors in V&A search with 500 status response and error message", async () => {
      vaMock.onGet(`/search?q=klint&page=1&page_size=10`).reply(500);

      await expect(fetchArtworksVA("klint")).rejects.toThrow(
        "V&A Museum API request failed"
      );
    });
  });
  describe("GET: Met Museum API functions", () => {
    afterEach(() => metMock.reset());

    it("searches Met records successfully with 200 status response", async () => {
      const mockSearchData = {
        objectIDs: [2, 5, 9],
      };

      const mockObjectData = [
        { objectID: 2, title: "Adulthood" },
        { objectID: 5, title: "Childhood" },
        { objectID: 9, title: "Youth" },
      ];
      // search endpoint returning objectIDs
      metMock.onGet("/search?q=klint").reply(200, mockSearchData);

      // object endpoint returning object details
      mockObjectData.forEach((object) => {
        metMock.onGet(`/objects/${object.objectID}`).reply(200, object);
      });

      const result = await fetchArtworksMet("klint");

      expect(result).toEqual(mockObjectData);
    });
    it("handles network errors in Met search with 500 status response and error message", async () => {
      metMock.onGet("/search?q=klint").reply(500);

      await expect(fetchArtworksMet("klint")).rejects.toThrow(
        "The Met Museum of Art API request failed"
      );
    });
    it("correct subset of objectIds is fetched based on currentPage", async () => {
      const mockSearchData = {
        objectIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      };
      const mockObjectData = [
        { objectID: 1, title: "Adulthood" },
        { objectID: 2, title: "Youth" },
        { objectID: 3, title: "Child" },
        { objectID: 4, title: "Flowers" },
        { objectID: 5, title: "Nude" },
        { objectID: 6, title: "Window" },
        { objectID: 7, title: "Beach" },
        { objectID: 8, title: "Skies" },
        { objectID: 9, title: "Fruit" },
        { objectID: 10, title: "Clouds" },
        { objectID: 11, title: "Horizon" },
        { objectID: 12, title: "Bath" },
      ];
      metMock.onGet("/search?q=klint").reply(200, mockSearchData);
      mockSearchData.objectIDs.forEach((id, index) => {
        metMock.onGet(`/objects/${id}`).reply(200, mockObjectData[index]);
      });

      const result = await fetchArtworksMet("klint", 2);

      console.log(result);

      expect(result).toEqual([
        { objectID: 11, title: "Horizon" },
        { objectID: 12, title: "Bath" },
      ]);
    });
    it("filters out invalid objectIDs when fetching Met artworks", async () => {
      const mockSearchData = {
        objectIDs: [2, 57, 9],
      };

      const mockObjectData = [
        { objectID: 2, title: "Adulthood" },
        null,
        { objectID: 9, title: "Youth" },
      ];
      const filteredObjectData = [
        { objectID: 2, title: "Adulthood" },
        { objectID: 9, title: "Youth" },
      ];
      metMock.onGet("/search?q=klint").reply(200, mockSearchData);
      mockSearchData.objectIDs.forEach((id, index) => {
        metMock.onGet(`/objects/${id}`).reply(200, mockObjectData[index]);
      });

      const result = await fetchArtworksMet("klint");

      expect(result).toEqual(filteredObjectData);
    });
  });
  describe("GET: combined API functions", () => {
    afterEach(() => {
      vaMock.reset();
      metMock.reset();
    });
    const mockCombinedArtworksArrayData = [
      {
        id: "123",
        title: "Blue Nude",
        artist: "Matisse",
        image: "va-image-url/full/!300,300/0/default.jpg",
        source: "Victoria and Albert Museum",
      },
      {
        id: "789",
        title: "Vegetables",
        artist: "Matisse",
        image: "met-image-url.jpg",
        source: "The Metropolitan Museum of Art",
      },
    ];
    it("fetches combined artworks as an array  of artwork objects with the specified response structure", async () => {
      vaMock.onGet(`/search?q=matisse&page=1&page_size=10`).reply(200, {
        records: [
          {
            systemNumber: "123",
            _primaryTitle: "Blue Nude",
            _primaryMaker: { name: "Matisse" },
            _images: { _iiif_image_base_url: "va-image-url" },
          },
        ],
      });

      metMock.onGet("/search?q=matisse").reply(200, {
        objectIDs: [789],
      });

      metMock.onGet(`/objects/789`).reply(200, {
        objectID: 789,
        title: "Vegetables",
        artistDisplayName: "Matisse",
        primaryImageSmall: "met-image-url.jpg",
      });

      const results = await fetchCombinedArtworks("matisse");
      expect(results).toEqual(mockCombinedArtworksArrayData);
    });
  });
});
