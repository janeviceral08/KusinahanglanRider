import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const styles = StyleSheet.create({
 
  categoriesPhoto: {
    width: '100%',
    height: 155,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3
  },
  subtitle: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 16,
    fontWeight: '100',
    fontStyle: 'italic',
    zIndex: 3,
    elevation: 3,
    position:'absolute',
    flex: 1
  },
  categoriesName: {
    flex: 1,
    fontFamily: 'FallingSky',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#043D08',
    padding : 1,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  categoriesStoreName: {
    flex: 1,
    fontFamily: 'FallingSky',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#043D08',
    padding : 1,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  categoriesAddress: {
    flex: 1,
    fontFamily: 'FallingSky',
    fontSize: 15,
    textAlign: 'center',
    color: '#043D08',
    paddingBottom : 5,
  },
  categoriesPrice: {
    flex: 1,
    fontFamily: 'FallingSky',
    fontSize: 15,
    textAlign: 'center',
    color: '#043D08',
    padding : 1,
  
  },
  categoriesInfo: {
    marginTop: 3,
    marginBottom: 5
  },
  text: {
    width: Dimensions.get('window').width,
    height: 200,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 32
  },
  categoriesItemContainer:{
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    margin : 5,
    backgroundColor: '#ffffb2'
  }
});

export default styles;
