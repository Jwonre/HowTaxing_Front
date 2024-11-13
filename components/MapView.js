import {View, Text, useWindowDimensions, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import NaverMapView, {Marker} from 'react-native-nmap';

import DropShadow from 'react-native-drop-shadow';

const MapView = props => {
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const mapRef = useRef(null);

  const {
    zoom,
    setZoom,
    myPosition,
    setMyPosition,
    listData,
    setListData,
    selectedItem,
    setSelectedItem,
    setCurrentPageIndex,
    getCurrentDistrict,
    initMap,
  } = props;

  const MarkerComponent = React.memo(
    ({item, onSelect}) => {
      const SIZE =
        item?.COMPLEX_NM1.length < 3
          ? 80
          : item?.COMPLEX_NM1.length * 10 + 30;

      return (
        <Marker
          key={item.COMPLEX_PK}
          coordinate={{
            latitude: item?.latitude ? Number(item?.latitude) : 0,
            longitude: item?.longitude ? Number(item?.longitude) : 0,
          }}
          anchor={{x: 0, y: 1}}
          minWidth={100}
          width={SIZE}
          height={80}
          onClick={onSelect}>
          <DropShadow
            style={{
              shadowColor: '#2F87FF',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              overflow: 'visible',
            }}>
            <View style={{...styles.marker, width: SIZE}}>
              <Text  style={styles.markerTitle}>{item.COMPLEX_NM1}</Text>
              <Text  style={styles.markerSubTitle}>{item.UNIT_CNT}세대</Text>
              <View style={styles.markerTriangle} />
            </View>
          </DropShadow>
        </Marker>
      );
    },
    [listData],
  );

  return (
    <NaverMapView
      ref={mapRef}
      style={{
        flex: 1,
        width: width - 40,
        height: 350,
        zIndex: 0,
      }}
      showsMyLocationButton={false}
      center={{
        latitude: Number(myPosition.latitude),
        longitude: Number(myPosition.longitude),
        zoom,
      }}
      zoomControl={false}
      isHideCollidedSymbols
      isForceShowIcon
      isHideCollidedCaptions
      useTextureView={true}
      onCameraChange={e => {
        if (initMap) {
          return;
        }

        if (e.zoom < 13) {
          setListData([]);
          return;
        }

        getCurrentDistrict(e.longitude, e.latitude);
      }}>
      {listData.map((item, index) => {
        return (
          <MarkerComponent
            key={index}
            item={item}
            onSelect={() => {
              //   getDongInfo(item.COMPLEX_PK);
              setSelectedItem(item);
              setCurrentPageIndex(1);
            }}
          />
        );
      })}
    </NaverMapView>
  );
};

const styles = StyleSheet.create({
  marker: {
    minWidth: 80,
    height: 45,
    backgroundColor: '#2F87FF',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  markerTitle: {
    width: '100%',
    fontFamily: 'Pretendard-Bold',
    fontSize: 10,
    color: '#fff',
  },
  markerSubTitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 8,
    color: '#fff',
  },
  markerTriangle: {
    position: 'absolute',
    left: 0,
    bottom: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: '#2F87FF',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
  },
});

export default MapView;
