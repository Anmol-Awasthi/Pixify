import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const TextEditor = ({
    editorRef,
    onChange,
}) => {
  return (
    <View style={{minHeight: 210}}>
        <RichToolbar
        actions={[
            actions.setBold,
            actions.setStrikethrough,
            actions.setItalic,
            actions.insertOrderedList,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.code,
            actions.line,
            actions.heading1,
            actions.heading4,
            actions.removeFormat,
        ]}
        iconMap={{
            [actions.heading1]: ({tintColor}) => (
                <Text style={{color: tintColor}}>H1</Text>
            ),
            [actions.heading4]: ({tintColor}) => (
                <Text style={{color: tintColor}}>H4</Text>
            )
        }}
        style={styles.richBar}
        selectedIconTintColor="white"
        flatContainerStyle={styles.flatStyle}
        editor={editorRef}
        disabled={false}
        />

        <RichEditor 
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.editor}
        placeholder="Your caption goes here..."
        onChange={onChange}
        />
    </View>
  )
}

export default TextEditor

const styles = StyleSheet.create({
    richBar: {
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        backgroundColor: '#17153B',
        borderWidth: 2,
        borderColor: 'gray',
    },
    rich: {
        minHeight: 150,
        flex: 1,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        borderWidth: 2,
        borderColor: 'gray',
        borderTopWidth: 0,
        padding: 5,
        backgroundColor: 'white',
    },
    editor: {
        color: 'black',
        placeholderColor: 'gray',
    },
    flatStyle: {
        paddingHorizontal: 8,
        gap: 3,
    }
})