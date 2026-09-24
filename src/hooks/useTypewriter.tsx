import { useEffect, useRef, useState } from "react"

export const useTypewriter = (
	words: string[],
	speed = 100,
	delay = 1000,
	active = true,
) => {
	// Start with the first word already typed, so the prerendered HTML reads
	// as a full sentence before JS runs.
	const [text, setText] = useState(words[0])
	const [index, setIndex] = useState(0)
	const [isDeleting, setIsDeleting] = useState(false)
	const [charIndex, setCharIndex] = useState(
		words[0].length,
	)
	const holdRef =
		useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => {
		if (!active) return
		const timeout = setTimeout(
			() => {
				if (!isDeleting) {
					// Typing effect
					if (charIndex < words[index].length) {
						setText(
							(prev) => prev + words[index][charIndex],
						)
						setCharIndex(charIndex + 1)
					} else {
						holdRef.current = setTimeout(
							() => setIsDeleting(true),
							delay,
						)
					}
				} else {
					// Deleting effect
					if (charIndex > 0) {
						setText(words[index].slice(0, charIndex - 1))
						setCharIndex(charIndex - 1)
					} else {
						setIsDeleting(false)
						setIndex((prev) => (prev + 1) % words.length)
					}
				}
			},
			isDeleting ? speed / 2 : speed,
		)

		return () => {
			clearTimeout(timeout)
			clearTimeout(holdRef.current)
		}
	}, [
		active,
		isDeleting,
		charIndex,
		index,
		words,
		speed,
		delay,
	])

	return text
}
