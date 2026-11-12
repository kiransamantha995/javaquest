import { basicSetup, EditorView } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands';
import { java } from '@codemirror/lang-java';
import { setDiagnostics } from '@codemirror/lint';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// ── Custom Neobrutalist + Game Themes ──────────────────────────────────────────

const darkHighlight = HighlightStyle.define([
  { tag: t.keyword, color: '#FFE600', fontWeight: 'bold' },
  { tag: t.definitionKeyword, color: '#FFE600', fontWeight: 'bold' },
  { tag: t.modifier, color: '#F59E0B' },
  { tag: t.typeName, color: '#38BDF8', fontWeight: '600' },
  { tag: t.standard(t.typeName), color: '#38BDF8' },
  { tag: t.string, color: '#10B981' },
  { tag: t.special(t.string), color: '#34D399' },
  { tag: t.number, color: '#FB923C' },
  { tag: t.bool, color: '#F43F5E', fontWeight: 'bold' },
  { tag: t.null, color: '#F43F5E' },
  { tag: t.comment, color: '#71717A', fontStyle: 'italic' },
  { tag: t.variableName, color: '#E2E8F0' },
  { tag: t.function(t.variableName), color: '#A78BFA' },
  { tag: t.definition(t.variableName), color: '#F8FAFC', fontWeight: 'bold' },
  { tag: t.operator, color: '#38BDF8' },
  { tag: t.punctuation, color: '#94A3B8' }
]);

const lightHighlight = HighlightStyle.define([
  { tag: t.keyword, color: '#9333EA', fontWeight: 'bold' },
  { tag: t.definitionKeyword, color: '#9333EA', fontWeight: 'bold' },
  { tag: t.modifier, color: '#D97706' },
  { tag: t.typeName, color: '#0284C7', fontWeight: '600' },
  { tag: t.standard(t.typeName), color: '#0284C7' },
  { tag: t.string, color: '#059669' },
  { tag: t.special(t.string), color: '#10B981' },
  { tag: t.number, color: '#EA580C' },
  { tag: t.bool, color: '#E11D48', fontWeight: 'bold' },
  { tag: t.null, color: '#E11D48' },
  { tag: t.comment, color: '#9CA3AF', fontStyle: 'italic' },
  { tag: t.variableName, color: '#18181B' },
  { tag: t.function(t.variableName), color: '#6366F1' },
  { tag: t.definition(t.variableName), color: '#09090B', fontWeight: 'bold' },
  { tag: t.operator, color: '#0284C7' },
  { tag: t.punctuation, color: '#52525B' }
]);

const darkEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: '#121216',
    color: '#F1F5F9',
    fontSize: '14px',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    height: '100%',
    borderRadius: '8px'
  },
  '.cm-content': {
    caretColor: '#FFE600',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    lineHeight: '1.65',
    padding: '12px 0'
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#FFE600',
    borderLeftWidth: '2.5px'
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'rgba(255, 230, 0, 0.25) !important'
  },
  '.cm-gutters': {
    backgroundColor: '#0E0E12',
    color: '#52525B',
    border: 'none',
    borderRight: '1.5px solid #27272A',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '12.5px',
    paddingRight: '6px'
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255, 230, 0, 0.12)',
    color: '#FFE600',
    fontWeight: 'bold'
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.035)'
  },
  '.cm-matchingBracket': {
    backgroundColor: 'rgba(56, 189, 248, 0.3)',
    color: '#38BDF8 !important',
    outline: '1px solid #38BDF8'
  },
  '.cm-nonmatchingBracket': {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    color: '#EF4444 !important'
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace'
  }
}, { dark: true });

const lightEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: '#FFFFFF',
    color: '#18181B',
    fontSize: '14px',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    height: '100%',
    borderRadius: '8px'
  },
  '.cm-content': {
    caretColor: '#18181B',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    lineHeight: '1.65',
    padding: '12px 0'
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#18181B',
    borderLeftWidth: '2.5px'
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'rgba(255, 230, 0, 0.35) !important'
  },
  '.cm-gutters': {
    backgroundColor: '#F8FAFC',
    color: '#94A3B8',
    border: 'none',
    borderRight: '1.5px solid #E2E8F0',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '12.5px',
    paddingRight: '6px'
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#FEF08A',
    color: '#854D0E',
    fontWeight: 'bold'
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(244, 244, 245, 0.7)'
  },
  '.cm-matchingBracket': {
    backgroundColor: '#BAE6FD',
    color: '#0369A1 !important',
    outline: '1px solid #0284C7'
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace'
  }
}, { dark: false });

// ── JavaEditor Factory ─────────────────────────────────────────────────────────

window.JavaEditor = {
  create(parent, opts = {}) {
    if (!parent) return null;
    const initialCode = opts.initialCode || '';
    const onChange = opts.onChange || (() => {});
    const onRun = opts.onRun || (() => {});
    const isDark = opts.isDark !== undefined ? opts.isDark : document.body.classList.contains('dark-theme');

    const themeCompartment = new Compartment();
    const syntaxCompartment = new Compartment();
    const readOnlyCompartment = new Compartment();

    const runKeymap = keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          onRun();
          return true;
        }
      },
      indentWithTab
    ]);

    const changeListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        java(),
        keymap.of(defaultKeymap),
        keymap.of(historyKeymap),
        runKeymap,
        changeListener,
        readOnlyCompartment.of(EditorState.readOnly.of(!!opts.readOnly)),
        themeCompartment.of(isDark ? darkEditorTheme : lightEditorTheme),
        syntaxCompartment.of(syntaxHighlighting(isDark ? darkHighlight : lightHighlight))
      ]
    });

    const view = new EditorView({
      state,
      parent
    });

    return {
      view,
      getValue() {
        return view.state.doc.toString();
      },
      setValue(code) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: String(code || '') }
        });
      },
      focus() {
        view.focus();
      },
      setTheme(dark) {
        view.dispatch({
          effects: [
            themeCompartment.reconfigure(dark ? darkEditorTheme : lightEditorTheme),
            syntaxCompartment.reconfigure(syntaxHighlighting(dark ? darkHighlight : lightHighlight))
          ]
        });
      },
      setLineError(lineNo, message) {
        try {
          const doc = view.state.doc;
          const targetLine = Math.min(Math.max(1, lineNo), doc.lines);
          const line = doc.line(targetLine);
          view.dispatch(setDiagnostics(view.state, [{
            from: line.from,
            to: line.to,
            severity: 'error',
            message: message || 'Compilation error on this line'
          }]));
          // Scroll into view
          view.dispatch({
            selection: { anchor: line.from },
            scrollIntoView: true
          });
        } catch (e) {
          console.warn('Error setting diagnostic:', e);
        }
      },
      clearErrors() {
        view.dispatch(setDiagnostics(view.state, []));
      },
      destroy() {
        view.destroy();
      }
    };
  }
};
