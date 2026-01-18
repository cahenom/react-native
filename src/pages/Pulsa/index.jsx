import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  FONT_SEDANG,
  GREEN_COLOR,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
} from '../../utils/const';
import {product_data, product_pulsa} from '../../data/product_pulsa';
import {CheckProduct} from '../../assets';
import BottomModal from '../../components/BottomModal';
import Input from '../../components/form/Input';
import {numberWithCommas} from '../../utils/formatter';
import {api} from '../../utils/api';

export default function Pulsa({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const [nomorTujuan, setNomor] = useState(null);
  const [type, setType] = useState('Pulsa');
  const [selectItem, setSelectItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data_pulsa, setPulsa] = useState([]);
  const [paket_data, setPaketData] = useState([]);
  const [loading, setLoading] = useState(false);

  const product_type = useMemo(() => ['Pulsa', 'Data'], []);

  const clearNomor = () => {
    setNomor(null);
  };

  const handleProduct = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/api/product/get-product-pulsa`, {
        customer_no: nomorTujuan,
      });
      setPulsa(response.data.data.pulsas);
      setPaketData(response.data.data.paket_data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleTopup = async () => {
    try {
      const response = await api.post(`/api/digiflaz/topup`, {
        customer_no: nomorTujuan,
        sku: selectItem?.product_sku,
      });
      navigation.navigate('SuccessNotif', {
        item: response.data,
        product: selectItem,
      });
      console.log('response topup : ', response.data);
    } catch (error) {
      console.log('response error : ', error);
    }
  };

  return (
    <>
      <SafeAreaView>
        <View style={{marginHorizontal: HORIZONTAL_MARGIN, marginTop: 15}}>
          <View
            style={{
              rowGap: 10,
            }}>
            <Input
              value={nomorTujuan}
              placeholder="Masukan nomor tujuan"
              onchange={text => setNomor(text)}
              ondelete={() => clearNomor()}
              type="numeric"
            />

            {loading ? (
              <View style={styles.button}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonLabel}>Loading</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleProduct()}>
                <Text style={styles.buttonLabel}>Tampilkan produk</Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              columnGap: 15,
            }}>
            {product_type.map(t => {
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.buttonTab,
                    t === type
                      ? {
                          borderBottomColor: BLUE_COLOR,
                          borderBottomWidth: 2,
                        }
                      : '',
                  ]}
                  onPress={() => setType(t)}>
                  <Text
                    style={[
                      styles.buttonTabLabel(isDarkMode),
                      t === type
                        ? {
                            color: BLUE_COLOR,
                          }
                        : '',
                    ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* PRODUK */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              rowGap: 25,
              marginTop: 20,
            }}>
            {type === 'Pulsa' ? (
              <>
                {data_pulsa.map(p => {
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.productWrapper(isDarkMode),
                        selectItem?.id === p.id
                          ? {
                              borderColor: GREEN_COLOR,
                            }
                          : '',
                      ]}
                      onPress={() => setSelectItem(p)}>
                      <Text style={styles.productLabel(isDarkMode)}>
                        {p.product_name}
                      </Text>
                      <Text style={styles.productPrice(isDarkMode)}>
                        Rp.{numberWithCommas(p.product_seller_price)}
                      </Text>
                      {selectItem?.id === p.id && (
                        <CheckProduct
                          width={20}
                          style={{
                            position: 'absolute',
                            right: 7,
                            top: 2,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </>
            ) : (
              <>
                {paket_data.map(d => {
                  return (
                    <TouchableOpacity
                      key={d.id}
                      style={[
                        styles.productWrapper(isDarkMode),
                        selectItem?.id === d.id
                          ? {
                              borderColor: GREEN_COLOR,
                            }
                          : '',
                      ]}
                      onPress={() => setSelectItem(d)}>
                      <Text style={styles.productLabel(isDarkMode)}>
                        {d.product_name}
                      </Text>
                      <Text style={styles.productPrice(isDarkMode)}>
                        Rp.{numberWithCommas(d.product_seller_price)}
                      </Text>
                      {selectItem?.id === d.id && (
                        <CheckProduct
                          width={20}
                          style={{
                            position: 'absolute',
                            right: 7,
                            top: 2,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
      {selectItem && (
        <View style={styles.bottom(isDarkMode)}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => setShowModal(!showModal)}>
            <Text style={styles.buttonLabel}>Lanjutkan</Text>
          </TouchableOpacity>
        </View>
      )}
      <BottomModal
        visible={showModal}
        onDismis={() => setShowModal(!showModal)}
        title="Detail Transaksi">
        <View>
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Nomor Tujuan</Text>
            <Text style={styles.valueModalData(isDarkMode)}>{nomorTujuan}</Text>
          </View>
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Produk</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {selectItem?.product_name}
            </Text>
          </View>
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Harga </Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              Rp.{numberWithCommas(selectItem?.product_seller_price)}
            </Text>
          </View>
        </View>
        <View style={styles.bottom(isDarkMode)}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => handleTopup()}>
            <Text style={styles.buttonLabel}>Bayar</Text>
          </TouchableOpacity>
        </View>
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontFamily: REGULAR_FONT,
    color: WHITE_BACKGROUND,
    textAlign: 'center',
  },
  buttonTab: {
    width: '47%',
    borderBottomColor: GREY_COLOR,
    borderBottomWidth: 1,
    padding: 5,
  },
  buttonTabLabel: isDarkMode => ({
    textAlign: 'center',
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    fontFamily: REGULAR_FONT,
  }),
  productWrapper: isDarkMode => ({
    borderWidth: 1,
    borderColor: GREY_COLOR,
    borderRadius: 10,
    padding: 20,
    width: '45%',
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
  }),
  productLabel: isDarkMode => ({
    fontFamily: MEDIUM_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  productPrice: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  bottom: isDarkMode => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
    padding: 10,
  }),
  bottomButton: {
    backgroundColor: BLUE_COLOR,
    padding: 10,
    borderRadius: 5,
  },
  modalData: isDarkMode => ({
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    paddingVertical: 5,
    rowGap: 5,
  }),
  labelModalData: isDarkMode => ({
    fontFamily: MEDIUM_FONT,
    fontSize: FONT_SEDANG,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  valueModalData: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
});
