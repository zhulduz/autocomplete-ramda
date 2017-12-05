'use babel'

import ramda from '../ramda.json'

describe("Ramda autocompletions", () => {
	let editor, getCompletions, provider

	const expectedForA = [
		"add",
		"addIndex",
		"adjust",
		"all",
		"allPass",
		"always",
		"and",
		"any",
		"anyPass",
		"ap",
		"aperture",
		"append",
		"apply",
		"applySpec",
		"applyTo",
		"ascend",
		"assoc",
		"assocPath",

	]
	getCompletions = () => {
		const cursor = editor.getLastCursor()

		const start = cursor.getBeginningOfCurrentWordBufferPosition()
		const end = cursor.getBufferPosition()


		const prefix = editor.getTextInRange([start, end])

		const request = {
			editor,
			bufferPosition: end,
			scopeDescriptor: cursor.getScopeDescriptor(),
			prefix
		}

		return provider.getSuggestions(request)
	}

	beforeEach(function () {

		waitsForPromise(function () {
			return atom.packages.activatePackage('autocomplete-ramda')
		})
		runs(function () {
			return provider = atom.packages.getActivePackage('autocomplete-ramda').mainModule.getProvider()
		})
		return waitsFor(function () {
			return Object.keys(provider.properties).length > 0
		})
	})
	describe("Ramda autocompletions", () => {
		beforeEach(function () {
				waitsForPromise(function () {
					return atom.packages.activatePackage('autocomplete-ramda')
				})
				waitsForPromise(function () {
					return atom.workspace.open('test.js')
				})
				return runs(function () {
					return editor = atom.workspace.getActiveTextEditor()
				})
			}
		)

		it('returns no completion when not using a prefix', () => {
			editor.setText('')
			expect(getCompletions().length).toBe(0)
		})


		it('returns no completion when not using a Ramda prefix', () => {
			editor.setText('spb')
			editor.setCursorBufferPosition([0, 3])
			expect(getCompletions().length).toBe(0)
		})

		it('returns no completion when using an incomplete Ramda prefix', () => {
			editor.setText('R')
			editor.setCursorBufferPosition([0, 1])
			expect(getCompletions().length).toBe(0)
		})

		it('returns no completion when using wrong prefix', () => {
			editor.setText(`P.`)
			editor.setCursorBufferPosition([0, 2])
			expect(getCompletions().length).toBe(0)
		})

		it('autocompletes when using a Ramda prefix and an incorrect case', () => {
			editor.setText(`r.`)
			editor.setCursorBufferPosition([0, 2])
			expect(getCompletions().length).toBe(0)
		})

		it('autocompletes when using only a Ramda prefix', () => {
			editor.setText(`R.`)
			editor.setCursorBufferPosition([0, 2])
			expect(getCompletions().length).toBe(ramda.length)
		})

		it('autocompletes when using a Ramda prefix', () => {
			editor.setText(`R.a`)
			editor.setCursorBufferPosition([0, 3])
			const suggestions = getCompletions()
			expect(suggestions).toBeDefined()
			expect(suggestions).toHaveLength(expectedForA.length)

			for (suggestion of suggestions) {
				expect(expectedForA.indexOf(suggestion.name)).toNotBe(-1)
			}
		})

		it('autocompletes when using a Ramda prefix and an incorrect case', () => {
			editor.setText(`R.A`)
			editor.setCursorBufferPosition([0, 3])
			const suggestions = getCompletions()
			expect(suggestions).toBeDefined()
			expect(suggestions).toHaveLength(expectedForA.length)

			for (suggestion of suggestions) {
				expect(expectedForA.indexOf(suggestion.name)).toBeGreaterThan(-1)
			}
		})

		it('should always returns suggestions with a name', () => {
			editor.setText(`R.`)
			editor.setCursorBufferPosition([0, 3])
			const suggestions = getCompletions()
			for (suggestion of suggestions) {
				expect(suggestion.name).toBeDefined()
			}
		})

		it('should always returns suggestions with a description', () => {
			editor.setText(`R.`)
			editor.setCursorBufferPosition([0, 3])
			const suggestions = getCompletions()
			for (suggestion of suggestions) {
				expect(suggestion.description).toBeDefined()
			}
		})

		it('should always returns suggestions with a value', () => {
			editor.setText(`R.`)
			editor.setCursorBufferPosition([0, 3])
			const suggestions = getCompletions()
			for (suggestion of suggestions) {
				expect(suggestion.leftLabel).toBeDefined()
			}
		})

		it('should always returns suggestions with a snippet', () => {
			editor.setText(`R.`)
			editor.setCursorBufferPosition([0, 3])
			const suggestions = getCompletions()
			for (suggestion of suggestions) {
				expect(suggestion.snippet).toBeDefined()
			}
		})
	})
})
