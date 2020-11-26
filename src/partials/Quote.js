class Quote {
  constructor() {
    this.quotes = [
      {
        "text": "If you get tired, learn to rest, not to quit.",
        "author": "Banksy"
      },
      {
        "text": "The secret of getting ahead is getting started.",
        "author": "Mark Twain"
      },
      {
        "text": "The best time to plant a tree was 20 years ago. The second best time is now.",
        "author": "Chinese Proverb"
      },
      {
        "text": "Do one thing every day that scares you.",
        "author": "Eleanor Roosevelt"
      },
      {
        "text": "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        "author": "Aristotle"
      },
      {
        "text": "I always did something I was a little not ready to do. I think that's how you grow. When there's that moment of 'Wow, I'm not really sure I can do this', and you push through those moments, that's when you have a breakthrough.",
        "author": "Marissa Mayer"
      },
      {
        "text": "Some people want it to happen, some wish it would happen, others make it happen.",
        "author": "Michael Jordan"
      },
      {
        "text": "Great things are done by a series of small things brought together.",
        "author": "Vincent Van Gogh"
      },
      {
        "text": "It's not the load that breaks you down, it's the way you carry it.",
        "author": "Lou Holtz"
      },
      {
        "text": "You've got to get up every morning with determination if you're going to go to bed with satisfaction.",
        "author": "George Lorimer"
      },
      {
        "text": "If opportunity doesn't knock, build a door.",
        "author": "Kurt Cobain"
      },
      {
        "text": "Hard work beats talent when talent doesn't work hard.",
        "author": "Tim Notke"
      },
      {
        "text": "If everything seems to be under control, you're not going fast enough.",
        "author": "Mario Andretti"
      },
      {
        "text": "Opportunity is missed by most people because it is dressed in overalls and looks like work.",
        "author": "Thomas Edison"
      },
      {
        "text": "The only difference between ordinary and extraordinary is that little extra.",
        "author": "Jimmy Johnson"
      },
      {
        "text": "The best way to appreciate your job is to imagine yourself without one.",
        "author": "Oscar Wilde"
      },
      {
        "text": "The miracle is not that we do this work, but that we are happy to do it.",
        "author": "Mother Teresa"
      },
      {
        "text": "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.",
        "author": "Earl Nightingale"
      },
      {
        "text": "If you work on something a little bit every day, you end up with something that is massive.",
        "author": "Kenneth Goldsmith"
      },
      {
        "text": "The big secret in life is that there is no secret. Whatever your goal, you can get there if you're willing to work.",
        "author": "Oprah Winfrey"
      },
      {
        "text": "If you cannot do great things, do small things in a great way.",
        "author": "Napoleon Hill"
      },
      {
        "text": "Amateurs sit around and wait for inspiration. The rest of us just get up and go to work.",
        "author": "Stephen King"
      },
      {
        "text": "Nothing will work unless you do.",
        "author": "Maya Angelou"
      },
      {
        "text": "Begin anywhere.",
        "author": "John Cage"
      },
      {
        "text": "Focus on being productive instead of busy.",
        "author": "Tim Ferriss"
      },
      {
        "text": "You don't need to see the whole staircase, just take the first step.",
        "author": "Martin Luther King Jr."
      },
      {
        "text": "I didn't get there by wishing for it, but by working for it.",
        "author": "Estee Lauder"
      },
      {
        "text": "Sunshine all the time makes a desert.",
        "author": "Arabic Proverb"
      },
      {
        "text": "I can and I will. Watch me.",
        "author": "Carrie Green"
      },
    ];
  }

  getRandom() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }
}

export default Quote;
