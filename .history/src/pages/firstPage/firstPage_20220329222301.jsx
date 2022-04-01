import React, { useEffect, useRef, useState } from 'react';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import useWatchLocation from '../../hooks/useWatchLocation';
import { geolocationOptions } from '../../constants/geolocationOptions';
import styles from './firstPage.module.css';
import LoadingSpin from '../../components/loadingSpin/loadingSpin';
const FirstPage = ({ kakao }) => {
  const { location: currentLocation, error: currentError } =
    useCurrentLocation(geolocationOptions);
  const [map, setMap] = useState(null);
  const mapRef = useRef();
  const [loading, setLoading] = useState(false);
  const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

  //드래그 state
  const dragRef = useRef();
  const reizeContainerRef = useRef();
  const [initialPos, setInitialPos] = useState(null);
  const [initialSize, setInitialSize] = useState(null);

  const test = () => {
    console.log(dragRef.current);
    console.log(dragRef);

    console.log('asd', reizeContainerRef.current.style.height);
  };
  const dragInitial = (e) => {
    setInitialPos(e.clientY);
    setInitialSize(reizeContainerRef.current.offsetHeight);
  };

  const dragResize = (e) => {
    console.log(parseInt(initialSize) + parseInt(e.clientY - initialPos));
    reizeContainerRef.current.style.height = `${
      parseInt(initialSize) + parseInt(e.clientY - initialPos)
    }px`;
  };

  //map 관련함수
  const placesSearchCB = (data, status, pagination, map) => {
    if (status === kakao.maps.services.Status.OK) {
      for (var i = 0; i < data.length; i++) {
        displayMarker(data[i]);
      }
    }
  };

  const displayMarker = (place) => {
    console.log(map);
    const marker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(place.y, place.x),
    });

    kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.setContent(
        '<div style="padding:5px;font-size:12px;">' +
          place.place_name +
          '</div>'
      );
      infowindow.open(map, marker);
    });
  };

  useEffect(() => {
    // if (!currentLocation) {
    //   console.log(currentLocation);
    //   setLoading(true);
    //   return;
    // }

    setLoading(false);
    // Cancel location watch after 3sec
    // setTimeout(() => {
    //   cancelLocationWatch();
    //   setIsWatchForLocation(false);
    // }, 3000);

    const mapContainer = mapRef.current;
    const mapOption = {
      center: new kakao.maps.LatLng(
        // currentLocation.latitude,
        // currentLocation.longitude
        37.1935,
        127.022611
      ),
      level: 3,
    };

    //const map = new kakao.maps.Map(mapContainer, mapOption);
    setMap(new kakao.maps.Map(mapContainer, mapOption));
    const a = new kakao.maps.Map(mapContainer, mapOption);
    console.log(a);
    const markerPosition = new kakao.maps.LatLng(
      // currentLocation.latitude,
      // currentLocation.longitude
      37.1935,
      127.022611
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    const ps = new kakao.maps.services.Places(map);
    ps.categorySearch('FD6', placesSearchCB, { useMapBounds: true });

    // 키워드로 장소를 검색합니다
  }, []);
  return (
    <section className={styles.container}>
      <div ref={reizeContainerRef} className={styles.map__group}>
        <div ref={mapRef} className={styles.map_container}>
          <LoadingSpin loading={loading} />
        </div>
      </div>
      <section className={styles.dragContainer}>
        <div
          ref={dragRef}
          onDrag={dragResize}
          onDragStart={dragInitial}
          draggable={true}
          className={styles.dragBtn}
          onClick={test}
        ></div>
      </section>
    </section>
  );
};

export default FirstPage;
